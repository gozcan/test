export type SubscriptionSnapshot = {
  plan: string;
  included_tokens_monthly: number;
  tokens_used: number;
  included_seats: number;
  seats_used: number;
  can_purchase_extra_tokens: boolean;
  can_purchase_extra_seats: boolean;
};

export type BillingPerformanceEndpointReport = {
  endpoint: string;
  sample_count: number;
  budget_ms: number;
  p50_ms: number;
  p95_ms: number;
  max_ms: number;
  over_budget: boolean;
};

export type BillingPerformanceReport = {
  generated_at: string;
  window_size: number;
  endpoints: BillingPerformanceEndpointReport[];
};

export type ApiErrorResponse = {
  error: {
    code: "VALIDATION_ERROR";
    message: string;
  };
};