import type { Request, Response, NextFunction } from "express";
import { recordBillingLatencySample } from "../../services/billing-performance.service";

export function billingLatencyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith("/api/billing")) {
    next();
    return;
  }

  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const elapsedNanoseconds = process.hrtime.bigint() - startedAt;
    const elapsedMs = Number(elapsedNanoseconds) / 1_000_000;
    recordBillingLatencySample(req.path, elapsedMs, res.statusCode);
  });

  next();
}