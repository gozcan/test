export type ExpenseStatus = "draft" | "submitted" | "approved" | "rejected";

export interface ExpenseDocument {
  _id: string;
  workspace_id: string;
  document_id?: string;
  external_ref?: string;
  vendor: string;
  amount: number;
  currency: "USD";
  status: ExpenseStatus;
  source: "document_extract";
  occurred_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseDocumentInput {
  id: string;
  workspace_id: string;
  vendor: string;
  amount: number;
  currency: "USD";
  source: "document_extract";
  document_id?: string;
  external_ref?: string;
  occurred_at?: string;
  created_at: string;
}
