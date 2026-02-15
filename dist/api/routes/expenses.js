"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExpenseRoutes = registerExpenseRoutes;
const zod_1 = require("zod");
const expenses_1 = require("../contracts/expenses");
const extraction_service_1 = require("../../services/extraction.service");
const errors_1 = require("../../server/errors");
const async_handler_1 = require("../../server/async-handler");
function zodIssues(error) {
    return error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));
}
function registerExpenseRoutes(app, expenseService) {
    app.post("/api/documents/extract", (0, async_handler_1.asyncHandler)(async (req, res) => {
        try {
            const payload = expenses_1.createExpenseDraftRequestSchema.parse(req.body ?? {});
            const draft = await (0, extraction_service_1.createExpenseDraftFromDocument)(expenseService, payload);
            return res.status(201).json(draft);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw (0, errors_1.validationError)("Invalid extract request payload", zodIssues(error));
            }
            throw error;
        }
    }));
    app.get("/api/expenses/export.csv", (0, async_handler_1.asyncHandler)(async (req, res) => {
        const workspaceId = req.query.workspace_id;
        if (typeof workspaceId !== "string" || workspaceId.trim().length === 0) {
            throw (0, errors_1.validationError)("workspace_id query parameter is required");
        }
        const csv = await expenseService.exportApprovedCsv(workspaceId);
        res.header("Content-Type", "text/csv");
        return res.send(`${csv}\n`);
    }));
}
