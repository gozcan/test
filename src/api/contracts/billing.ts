import { z } from "zod";

export const subscriptionSnapshotSchema = z.object({
  plan: z.enum(["starter", "growth", "enterprise"]),
  included_tokens_monthly: z.number().int().nonnegative(),
  tokens_used: z.number().int().nonnegative(),
  included_seats: z.number().int().nonnegative(),
  seats_used: z.number().int().nonnegative(),
  can_purchase_extra_tokens: z.boolean(),
  can_purchase_extra_seats: z.boolean(),
});

export type SubscriptionSnapshot = z.infer<typeof subscriptionSnapshotSchema>;
