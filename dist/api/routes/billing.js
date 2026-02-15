"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBillingRoutes = registerBillingRoutes;
const subscription_service_1 = require("../../services/subscription.service");
function registerBillingRoutes(app) {
    app.get("/api/billing/subscription", (_req, res) => {
        return res.json((0, subscription_service_1.getSubscriptionSnapshot)());
    });
}
