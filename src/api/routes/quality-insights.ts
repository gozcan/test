import type { Express, Request, Response } from "express";
import { getQualityInsights, QualityInsightsValidationError } from "../../services/quality-insights.service";

function getSingleQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }
  return typeof value === "string" ? value : undefined;
}

export function registerQualityInsightsRoutes(app: Express) {
  app.get("/api/insights/quality", (req: Request, res: Response) => {
    try {
      const startDate = getSingleQueryValue(req.query.start_date);
      const endDate = getSingleQueryValue(req.query.end_date);
      const workflowType = getSingleQueryValue(req.query.workflow_type);
      const insights = getQualityInsights({
        start_date: startDate,
        end_date: endDate,
        workflow_type: workflowType as "all" | "ocr_extract" | "policy_check" | "erp_sync" | undefined,
      });
      return res.status(200).json(insights);
    } catch (error) {
      if (error instanceof QualityInsightsValidationError) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: error.message,
            details: error.details,
          },
        });
      }

      return res.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Could not load quality insights.",
        },
      });
    }
  });
}
