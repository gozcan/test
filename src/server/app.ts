import express from "express";
import { registerExpenseRoutes } from "../api/routes/expenses";
import { registerBillingRoutes } from "../api/routes/billing";
import { InMemoryExpenseRepository } from "../db/expense.repository";
import { ExpenseService } from "../services/expense.service";
import { errorHandler, notFoundHandler, requestContext } from "./middleware";

export interface AppDependencies {
  expenseService?: ExpenseService;
}

export function createApp(deps: AppDependencies = {}) {
  const app = express();
  const expenseService = deps.expenseService ?? new ExpenseService(new InMemoryExpenseRepository());

  app.use(express.json({ limit: "10mb" }));
  app.use(requestContext);

  app.get("/health", (_req, res) => res.json({ ok: true }));
  registerExpenseRoutes(app, expenseService);
  registerBillingRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
