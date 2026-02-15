import type { CreateExpenseDraftRequest, ExpenseDraftResponse } from "../api/contracts/expenses";
import type { ExpenseRepository } from "../db/expense.repository";

function toIsoDate(now: Date): string {
  return now.toISOString();
}

function csvEscape(input: string): string {
  if (input.includes(",") || input.includes("\"") || input.includes("\n")) {
    return `"${input.replace(/"/g, "\"\"")}"`;
  }
  return input;
}

export class ExpenseService {
  constructor(
    private readonly repo: ExpenseRepository,
    private readonly generateId: () => string = () => `exp_${Date.now()}`,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async createDraft(input: CreateExpenseDraftRequest): Promise<ExpenseDraftResponse> {
    const createdAt = toIsoDate(this.now());
    const stored = await this.repo.createDraft({
      id: this.generateId(),
      workspace_id: input.workspace_id,
      vendor: input.vendor,
      amount: input.amount,
      currency: input.currency,
      source: "document_extract",
      created_at: createdAt,
      document_id: input.document_id,
      external_ref: input.external_ref,
      occurred_at: input.occurred_at,
    });

    return {
      id: stored._id,
      workspace_id: stored.workspace_id,
      document_id: stored.document_id,
      external_ref: stored.external_ref,
      vendor: stored.vendor,
      amount: stored.amount,
      currency: stored.currency,
      status: "draft",
      source: stored.source,
      occurred_at: stored.occurred_at,
      created_at: stored.created_at,
      updated_at: stored.updated_at,
    };
  }

  async exportApprovedCsv(workspaceId: string): Promise<string> {
    const rows = await this.repo.listByStatus(workspaceId, "approved");
    const lines = rows.map((row) => `${csvEscape(row.vendor)},${row.amount.toFixed(2)},${row.status}`);
    return ["vendor,amount,status", ...lines].join("\n");
  }
}
