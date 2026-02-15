import type { Express, Request, Response } from "express";
import { getSubscriptionSnapshot } from "../../services/subscription.service";

export function registerBillingRoutes(app: Express) {
  app.get("/api/billing/subscription", (_req: Request, res: Response) => {
    return res.json(getSubscriptionSnapshot());
  });
}
