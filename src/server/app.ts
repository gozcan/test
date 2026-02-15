import express from "express";
import { registerExpenseRoutes } from "../api/routes/expenses";
import { registerBillingRoutes } from "../api/routes/billing";
import { registerQualityInsightsRoutes } from "../api/routes/quality-insights";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  registerExpenseRoutes(app);
  registerBillingRoutes(app);
  registerQualityInsightsRoutes(app);
  return app;
}
