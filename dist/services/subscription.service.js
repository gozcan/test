"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionSnapshot = getSubscriptionSnapshot;
function getSubscriptionSnapshot() {
    return {
        plan: "starter",
        included_tokens_monthly: 100000,
        tokens_used: 0,
        included_seats: 3,
        seats_used: 1,
        can_purchase_extra_tokens: true,
        can_purchase_extra_seats: true,
    };
}
