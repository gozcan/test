import express from "express";
import { registerExpenseRoutes } from "../api/routes/expenses";
import { registerBillingRoutes } from "../api/routes/billing";
import { errorHandler } from "../api/middleware/error-handler";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  registerExpenseRoutes(app);
  registerBillingRoutes(app);
  app.use(errorHandler);
  return app;
}
