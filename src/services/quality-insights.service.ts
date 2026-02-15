export const WORKFLOW_TYPES = ["ocr_extract", "policy_check", "erp_sync"] as const;

export type WorkflowType = (typeof WORKFLOW_TYPES)[number];
type WorkflowTypeFilter = WorkflowType | "all";
type WorkflowRunStatus = "completed" | "failed";

export interface WorkflowRun {
  id: string;
  workflow_type: WorkflowType;
  status: WorkflowRunStatus;
  retries: number;
  started_at: string;
}

export interface QualityInsightsFilters {
  start_date?: string;
  end_date?: string;
  workflow_type?: WorkflowTypeFilter;
}

export interface QualityInsightsResponse {
  filters: {
    start_date: string;
    end_date: string;
    workflow_type: WorkflowTypeFilter;
  };
  summary: {
    total_runs: number;
    failed_runs: number;
    retry_count: number;
    completion_rate: number;
  };
  by_workflow: Array<{
    workflow_type: WorkflowType;
    total_runs: number;
    failed_runs: number;
    retry_count: number;
    completion_rate: number;
  }>;
}

export class QualityInsightsValidationError extends Error {
  public readonly details: string[];

  constructor(details: string[]) {
    super("Invalid quality insights query parameters.");
    this.name = "QualityInsightsValidationError";
    this.details = details;
  }
}

const WORKFLOW_RUNS: WorkflowRun[] = [
  { id: "wf_01", workflow_type: "ocr_extract", status: "completed", retries: 0, started_at: "2026-02-01T10:11:00.000Z" },
  { id: "wf_02", workflow_type: "ocr_extract", status: "failed", retries: 1, started_at: "2026-02-02T10:11:00.000Z" },
  { id: "wf_03", workflow_type: "policy_check", status: "completed", retries: 2, started_at: "2026-02-03T10:11:00.000Z" },
  { id: "wf_04", workflow_type: "erp_sync", status: "completed", retries: 0, started_at: "2026-02-03T14:11:00.000Z" },
  { id: "wf_05", workflow_type: "policy_check", status: "failed", retries: 3, started_at: "2026-02-04T10:11:00.000Z" },
  { id: "wf_06", workflow_type: "erp_sync", status: "completed", retries: 1, started_at: "2026-02-05T10:11:00.000Z" },
  { id: "wf_07", workflow_type: "ocr_extract", status: "completed", retries: 0, started_at: "2026-02-06T10:11:00.000Z" },
];

function roundTo2(value: number): number {
  return Number(value.toFixed(2));
}

function computeMetrics(runs: WorkflowRun[]) {
  const totalRuns = runs.length;
  const failedRuns = runs.filter((run) => run.status === "failed").length;
  const retryCount = runs.reduce((sum, run) => sum + run.retries, 0);
  const completionRate = totalRuns === 0 ? 0 : roundTo2(((totalRuns - failedRuns) / totalRuns) * 100);

  return {
    total_runs: totalRuns,
    failed_runs: failedRuns,
    retry_count: retryCount,
    completion_rate: completionRate,
  };
}

function isIsoDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeDateRange(filters: QualityInsightsFilters): { startDate: Date; endDate: Date; workflowType: WorkflowTypeFilter } {
  const workflowType = filters.workflow_type ?? "all";
  const startDateRaw = filters.start_date ?? "1900-01-01";
  const endDateRaw = filters.end_date ?? "9999-12-31";
  const errors: string[] = [];

  if (!isIsoDateString(startDateRaw)) {
    errors.push("start_date must be in YYYY-MM-DD format.");
  }

  if (!isIsoDateString(endDateRaw)) {
    errors.push("end_date must be in YYYY-MM-DD format.");
  }

  if (workflowType !== "all" && !WORKFLOW_TYPES.includes(workflowType)) {
    errors.push(`workflow_type must be one of: all, ${WORKFLOW_TYPES.join(", ")}.`);
  }

  if (errors.length > 0) {
    throw new QualityInsightsValidationError(errors);
  }

  const startDate = new Date(`${startDateRaw}T00:00:00.000Z`);
  const endDate = new Date(`${endDateRaw}T23:59:59.999Z`);

  if (Number.isNaN(startDate.getTime())) {
    errors.push("start_date is not a valid date.");
  }

  if (Number.isNaN(endDate.getTime())) {
    errors.push("end_date is not a valid date.");
  }

  if (errors.length > 0) {
    throw new QualityInsightsValidationError(errors);
  }

  if (startDate.getTime() > endDate.getTime()) {
    throw new QualityInsightsValidationError(["start_date must be before or equal to end_date."]);
  }

  return { startDate, endDate, workflowType };
}

export function getQualityInsights(filters: QualityInsightsFilters): QualityInsightsResponse {
  const { startDate, endDate, workflowType } = normalizeDateRange(filters);
  const filteredRuns = WORKFLOW_RUNS.filter((run) => {
    const startedAt = new Date(run.started_at);
    const isInDateRange = startedAt.getTime() >= startDate.getTime() && startedAt.getTime() <= endDate.getTime();
    const isWorkflowMatch = workflowType === "all" ? true : run.workflow_type === workflowType;
    return isInDateRange && isWorkflowMatch;
  });

  const byWorkflow = WORKFLOW_TYPES.map((type) => {
    const workflowRuns = filteredRuns.filter((run) => run.workflow_type === type);
    return {
      workflow_type: type,
      ...computeMetrics(workflowRuns),
    };
  });

  return {
    filters: {
      start_date: filters.start_date ?? "1900-01-01",
      end_date: filters.end_date ?? "9999-12-31",
      workflow_type: workflowType,
    },
    summary: computeMetrics(filteredRuns),
    by_workflow: byWorkflow,
  };
}
