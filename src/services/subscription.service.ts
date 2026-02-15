import type {
  AddonType,
  OnboardingQuoteRequest,
  OnboardingQuoteResponse,
  SubscriptionSnapshot,
} from "../api/contracts/billing";
import type { SubscriptionDocument, TokenLedgerDocument } from "../db/mongo";
import { badRequest } from "../api/middleware/error-handler";

const INCLUDED_TOKENS_MONTHLY = 100000;
const INCLUDED_SEATS = 3;
const TOKEN_ADDON_UNIT = 50000;
const TOKEN_ADDON_UNIT_PRICE_USD = 20;
const SEAT_ADDON_UNIT_PRICE_USD = 15;

const subscriptions = new Map<string, SubscriptionDocument>();
const tokenLedger = new Map<string, TokenLedgerDocument[]>();

function nowIso() {
  return new Date().toISOString();
}

function ensureSubscription(orgId: string): SubscriptionDocument {
  const existing = subscriptions.get(orgId);
  if (existing) {
    return existing;
  }

  const now = nowIso();
  const created: SubscriptionDocument = {
    org_id: orgId,
    plan: "starter",
    included_tokens_monthly: INCLUDED_TOKENS_MONTHLY,
    included_seats: INCLUDED_SEATS,
    tokens_used: 0,
    seats_used: 1,
    addon_tokens_purchased: 0,
    addon_seats_purchased: 0,
    created_at: now,
    updated_at: now,
  };
  subscriptions.set(orgId, created);
  return created;
}

function toSnapshot(doc: SubscriptionDocument): SubscriptionSnapshot {
  const tokensCapacity = doc.included_tokens_monthly + doc.addon_tokens_purchased;
  const seatsCapacity = doc.included_seats + doc.addon_seats_purchased;
  return {
    org_id: doc.org_id,
    plan: doc.plan,
    included_tokens_monthly: doc.included_tokens_monthly,
    included_seats: doc.included_seats,
    tokens_used: doc.tokens_used,
    seats_used: doc.seats_used,
    addon_tokens_purchased: doc.addon_tokens_purchased,
    addon_seats_purchased: doc.addon_seats_purchased,
    token_balance_available: Math.max(tokensCapacity - doc.tokens_used, 0),
    seat_capacity_available: Math.max(seatsCapacity - doc.seats_used, 0),
    can_purchase_extra_tokens: true,
    can_purchase_extra_seats: true,
  };
}

function assertPositiveInt(value: unknown, field: string) {
  if (!Number.isInteger(value) || Number(value) <= 0) {
    badRequest(`${field} must be a positive integer.`, "VALIDATION_ERROR");
  }
}

function assertNonNegativeInt(value: unknown, field: string) {
  if (!Number.isInteger(value) || Number(value) < 0) {
    badRequest(`${field} must be a non-negative integer.`, "VALIDATION_ERROR");
  }
}

export function getSubscriptionSnapshot(orgId: string): SubscriptionSnapshot {
  return toSnapshot(ensureSubscription(orgId));
}

export function getOnboardingQuote(orgId: string, input: OnboardingQuoteRequest): OnboardingQuoteResponse {
  assertNonNegativeInt(input.expected_tokens_monthly, "expected_tokens_monthly");
  assertNonNegativeInt(input.expected_seats, "expected_seats");

  const subscription = ensureSubscription(orgId);
  const tokenGap = Math.max(input.expected_tokens_monthly - subscription.included_tokens_monthly, 0);
  const seatGap = Math.max(input.expected_seats - subscription.included_seats, 0);

  const recommendedTokenUnits = Math.ceil(tokenGap / TOKEN_ADDON_UNIT);
  const recommendedSeatUnits = seatGap;

  return {
    subscription: toSnapshot(subscription),
    recommended_token_addon_units: recommendedTokenUnits,
    recommended_seat_addon_units: recommendedSeatUnits,
    estimated_monthly_cost_usd:
      recommendedTokenUnits * TOKEN_ADDON_UNIT_PRICE_USD + recommendedSeatUnits * SEAT_ADDON_UNIT_PRICE_USD,
  };
}

function applyAddon(doc: SubscriptionDocument, type: AddonType, quantity: number) {
  if (type === "tokens") {
    doc.addon_tokens_purchased += TOKEN_ADDON_UNIT * quantity;
  } else {
    doc.addon_seats_purchased += quantity;
  }
}

export function purchaseAddon(
  orgId: string,
  addonType: AddonType,
  quantity: number,
): { snapshot: SubscriptionSnapshot; transactionId: string } {
  assertPositiveInt(quantity, "quantity");

  if (addonType !== "tokens" && addonType !== "seats") {
    badRequest(`addon_type must be one of: tokens, seats.`, "VALIDATION_ERROR");
  }

  const subscription = ensureSubscription(orgId);
  applyAddon(subscription, addonType, quantity);
  subscription.updated_at = nowIso();

  const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const ledgerEntry: TokenLedgerDocument = {
    id: transactionId,
    org_id: orgId,
    addon_type: addonType,
    quantity,
    created_at: subscription.updated_at,
  };
  const orgLedger = tokenLedger.get(orgId) ?? [];
  orgLedger.push(ledgerEntry);
  tokenLedger.set(orgId, orgLedger);

  return {
    snapshot: toSnapshot(subscription),
    transactionId,
  };
}

export function getAddonLedger(orgId: string): TokenLedgerDocument[] {
  return [...(tokenLedger.get(orgId) ?? [])];
}
