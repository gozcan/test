import type { Express, Request, Response } from "express";
import { ZodError } from "zod";
import { createExpenseDraftRequestSchema } from "../contracts/expenses";
import { createExpenseDraftFromDocument } from "../../services/extraction.service";
import type { ExpenseService } from "../../services/expense.service";
import { validationError } from "../../server/errors";
import { asyncHandler } from "../../server/async-handler";

function zodIssues(error: ZodError): Array<{ path: string; message: string }> {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function registerExpenseRoutes(app: Express, expenseService: ExpenseService) {
  app.post("/api/documents/extract", asyncHandler(async (req: Request, res: Response) => {
    try {
      const payload = createExpenseDraftRequestSchema.parse(req.body ?? {});
      const draft = await createExpenseDraftFromDocument(expenseService, payload);
      return res.status(201).json(draft);
    } catch (error) {
      if (error instanceof ZodError) {
        throw validationError("Invalid extract request payload", zodIssues(error));
      }
      throw error;
    }
  }));

  app.get("/api/expenses/export.csv", asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.query.workspace_id;
    if (typeof workspaceId !== "string" || workspaceId.trim().length === 0) {
      throw validationError("workspace_id query parameter is required");
    }

    const csv = await expenseService.exportApprovedCsv(workspaceId);
    res.header("Content-Type", "text/csv");
    return res.send(`${csv}\n`);
  }));
}
