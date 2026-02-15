import type { Express, Request, Response } from "express";
import type { OnboardingQuoteRequest, PurchaseAddonRequest } from "../contracts/billing";
import { badRequest } from "../middleware/error-handler";
import { getOnboardingQuote, getSubscriptionSnapshot, purchaseAddon } from "../../services/subscription.service";

function getOrgId(req: Request): string {
  const headerValue = req.header("x-org-id");
  return headerValue && headerValue.trim().length > 0 ? headerValue.trim() : "demo-org";
}

function parseOnboardingQuoteRequest(body: unknown): OnboardingQuoteRequest {
  if (!body || typeof body !== "object") {
    badRequest("Request body is required.", "VALIDATION_ERROR");
  }

  const input = body as Partial<OnboardingQuoteRequest>;
  return {
    expected_tokens_monthly: Number(input.expected_tokens_monthly),
    expected_seats: Number(input.expected_seats),
  };
}

function parsePurchaseRequest(body: unknown): PurchaseAddonRequest {
  if (!body || typeof body !== "object") {
    badRequest("Request body is required.", "VALIDATION_ERROR");
  }
  const input = body as Partial<PurchaseAddonRequest>;
  return {
    addon_type: String(input.addon_type ?? ""),
    quantity: Number(input.quantity),
  } as PurchaseAddonRequest;
}

export function registerBillingRoutes(app: Express) {
  app.get("/api/billing/subscription", (req: Request, res: Response) => {
    return res.json(getSubscriptionSnapshot(getOrgId(req)));
  });

  app.post("/api/billing/onboarding/quote", (req: Request, res: Response) => {
    const input = parseOnboardingQuoteRequest(req.body);
    const quote = getOnboardingQuote(getOrgId(req), input);
    return res.status(200).json(quote);
  });

  app.post("/api/billing/addons/purchase", (req: Request, res: Response) => {
    const input = parsePurchaseRequest(req.body);
    const result = purchaseAddon(getOrgId(req), input.addon_type, input.quantity);
    return res.status(201).json({
      subscription: result.snapshot,
      transaction_id: result.transactionId,
    });
  });
}
