"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionSnapshotSchema = void 0;
const zod_1 = require("zod");
exports.subscriptionSnapshotSchema = zod_1.z.object({
    plan: zod_1.z.enum(["starter", "growth", "enterprise"]),
    included_tokens_monthly: zod_1.z.number().int().nonnegative(),
    tokens_used: zod_1.z.number().int().nonnegative(),
    included_seats: zod_1.z.number().int().nonnegative(),
    seats_used: zod_1.z.number().int().nonnegative(),
    can_purchase_extra_tokens: zod_1.z.boolean(),
    can_purchase_extra_seats: zod_1.z.boolean(),
});
