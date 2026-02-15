export type AddonType = "tokens" | "seats";

export interface SubscriptionSnapshot {
  org_id: string;
  plan: "starter";
  included_tokens_monthly: number;
  included_seats: number;
  tokens_used: number;
  seats_used: number;
  addon_tokens_purchased: number;
  addon_seats_purchased: number;
  token_balance_available: number;
  seat_capacity_available: number;
  can_purchase_extra_tokens: boolean;
  can_purchase_extra_seats: boolean;
}

export interface OnboardingQuoteRequest {
  expected_tokens_monthly: number;
  expected_seats: number;
}

export interface OnboardingQuoteResponse {
  subscription: SubscriptionSnapshot;
  recommended_token_addon_units: number;
  recommended_seat_addon_units: number;
  estimated_monthly_cost_usd: number;
}

export interface PurchaseAddonRequest {
  addon_type: AddonType;
  quantity: number;
}

export interface PurchaseAddonResponse {
  subscription: SubscriptionSnapshot;
  transaction_id: string;
}
