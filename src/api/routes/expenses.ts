import type { Express, Request, Response } from "express";
import { createExpenseDraftFromDocument } from "../../services/extraction.service";

export function registerExpenseRoutes(app: Express) {
  app.post("/api/documents/extract", async (req: Request, res: Response) => {
    const draft = await createExpenseDraftFromDocument(req.body ?? {});
    return res.status(201).json(draft);
  });

  app.get("/api/expenses/export.csv", (_req: Request, res: Response) => {
    res.header("Content-Type", "text/csv");
    res.send("vendor,amount,status\nSample Vendor,42.50,approved\n");
  });
}
