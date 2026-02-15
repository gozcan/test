import { z } from "zod";

export const createExpenseDraftRequestSchema = z.object({
  workspace_id: z.string().trim().min(1),
  document_id: z.string().trim().min(1).optional(),
  external_ref: z.string().trim().min(1).optional(),
  vendor: z.string().trim().min(1),
  amount: z.number().finite().positive(),
  currency: z.literal("USD").default("USD"),
  occurred_at: z.string().datetime().optional(),
});

export type CreateExpenseDraftRequest = z.infer<typeof createExpenseDraftRequestSchema>;

export const expenseDraftResponseSchema = z.object({
  id: z.string().min(1),
  workspace_id: z.string().min(1),
  document_id: z.string().min(1).optional(),
  external_ref: z.string().min(1).optional(),
  vendor: z.string().min(1),
  amount: z.number().positive(),
  currency: z.literal("USD"),
  status: z.literal("draft"),
  source: z.literal("document_extract"),
  occurred_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ExpenseDraftResponse = z.infer<typeof expenseDraftResponseSchema>;
