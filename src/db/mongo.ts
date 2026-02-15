import type { AddonType } from "../api/contracts/billing";

export type MongoCollections =
  | "documents"
  | "expenses"
  | "subscriptions"
  | "token_ledger"
  | "subscription_addons";

export interface MongoIndexSpec {
  keys: Record<string, 1 | -1>;
  unique?: boolean;
  sparse?: boolean;
  name: string;
}

export interface SubscriptionDocument {
  org_id: string;
  plan: "starter";
  included_tokens_monthly: number;
  included_seats: number;
  tokens_used: number;
  seats_used: number;
  addon_tokens_purchased: number;
  addon_seats_purchased: number;
  created_at: string;
  updated_at: string;
}

export interface TokenLedgerDocument {
  id: string;
  org_id: string;
  addon_type: AddonType;
  quantity: number;
  created_at: string;
}

export const collectionIndexes: Record<MongoCollections, MongoIndexSpec[]> = {
  documents: [],
  expenses: [],
  subscriptions: [{ name: "ux_subscriptions_org_id", keys: { org_id: 1 }, unique: true }],
  token_ledger: [
    { name: "ix_token_ledger_org_created_at", keys: { org_id: 1, created_at: -1 } },
    { name: "ux_token_ledger_id", keys: { id: 1 }, unique: true },
  ],
  subscription_addons: [{ name: "ix_subscription_addons_org_id", keys: { org_id: 1 } }],
};

export function collectionName(name: MongoCollections): string {
  return name;
}
