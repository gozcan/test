"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseDraftResponseSchema = exports.createExpenseDraftRequestSchema = void 0;
const zod_1 = require("zod");
exports.createExpenseDraftRequestSchema = zod_1.z.object({
    workspace_id: zod_1.z.string().trim().min(1),
    document_id: zod_1.z.string().trim().min(1).optional(),
    external_ref: zod_1.z.string().trim().min(1).optional(),
    vendor: zod_1.z.string().trim().min(1),
    amount: zod_1.z.number().finite().positive(),
    currency: zod_1.z.literal("USD").default("USD"),
    occurred_at: zod_1.z.string().datetime().optional(),
});
exports.expenseDraftResponseSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    workspace_id: zod_1.z.string().min(1),
    document_id: zod_1.z.string().min(1).optional(),
    external_ref: zod_1.z.string().min(1).optional(),
    vendor: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.literal("USD"),
    status: zod_1.z.literal("draft"),
    source: zod_1.z.literal("document_extract"),
    occurred_at: zod_1.z.string().datetime().optional(),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
});
