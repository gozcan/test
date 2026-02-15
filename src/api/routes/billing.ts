import type { Express, Request, Response } from "express";
import { getSubscriptionSnapshot } from "../../services/subscription.service";
import { getBillingPerformanceGuardrails } from "../../services/billing-performance.service";

const WINDOW_SIZE_MIN = 1;
const WINDOW_SIZE_MAX = 500;

function parseWindowSize(rawWindowSize: unknown): number | null | undefined {
  if (rawWindowSize === undefined) {
    return undefined;
  }

  const value = Number(rawWindowSize);
  if (!Number.isInteger(value) || value < WINDOW_SIZE_MIN || value > WINDOW_SIZE_MAX) {
    return null;
  }

  return value;
}

export function registerBillingRoutes(app: Express) {
  app.get("/api/billing/subscription", (_req: Request, res: Response) => {
    return res.json(getSubscriptionSnapshot());
  });

  app.get("/api/billing/performance/guardrails", (req: Request, res: Response) => {
    const windowSize = parseWindowSize(req.query.window_size);
    if (windowSize === null) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: `window_size must be an integer between ${WINDOW_SIZE_MIN} and ${WINDOW_SIZE_MAX}`,
        },
      });
    }

    return res.json(getBillingPerformanceGuardrails(windowSize));
  });
}