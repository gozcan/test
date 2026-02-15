import type { CreateExpenseDocumentInput, ExpenseDocument } from "./models/expense.model";

export interface ExpenseRepository {
  createDraft(input: CreateExpenseDocumentInput): Promise<ExpenseDocument>;
  listByStatus(workspaceId: string, status: ExpenseDocument["status"]): Promise<ExpenseDocument[]>;
}

export class InMemoryExpenseRepository implements ExpenseRepository {
  private readonly items = new Map<string, ExpenseDocument>();

  async createDraft(input: CreateExpenseDocumentInput): Promise<ExpenseDocument> {
    const doc: ExpenseDocument = {
      _id: input.id,
      workspace_id: input.workspace_id,
      vendor: input.vendor,
      amount: input.amount,
      currency: input.currency,
      source: input.source,
      status: "draft",
      created_at: input.created_at,
      updated_at: input.created_at,
      document_id: input.document_id,
      external_ref: input.external_ref,
      occurred_at: input.occurred_at,
    };

    this.items.set(doc._id, doc);
    return doc;
  }

  async listByStatus(workspaceId: string, status: ExpenseDocument["status"]): Promise<ExpenseDocument[]> {
    const rows: ExpenseDocument[] = [];
    for (const value of this.items.values()) {
      if (value.workspace_id === workspaceId && value.status === status) {
        rows.push(value);
      }
    }
    return rows;
  }
}
