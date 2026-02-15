import express from "express";
import { registerExpenseRoutes } from "../api/routes/expenses";
import { registerBillingRoutes } from "../api/routes/billing";
import { billingLatencyMiddleware } from "./middleware/billing-latency.middleware";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(billingLatencyMiddleware);

  app.get("/health", (_req, res) => res.json({ ok: true }));
  registerExpenseRoutes(app);
  registerBillingRoutes(app);
  return app;
}