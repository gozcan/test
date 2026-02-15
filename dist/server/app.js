"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const expenses_1 = require("../api/routes/expenses");
const billing_1 = require("../api/routes/billing");
const expense_repository_1 = require("../db/expense.repository");
const expense_service_1 = require("../services/expense.service");
const middleware_1 = require("./middleware");
function createApp(deps = {}) {
    const app = (0, express_1.default)();
    const expenseService = deps.expenseService ?? new expense_service_1.ExpenseService(new expense_repository_1.InMemoryExpenseRepository());
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(middleware_1.requestContext);
    app.get("/health", (_req, res) => res.json({ ok: true }));
    (0, expenses_1.registerExpenseRoutes)(app, expenseService);
    (0, billing_1.registerBillingRoutes)(app);
    app.use(middleware_1.notFoundHandler);
    app.use(middleware_1.errorHandler);
    return app;
}
