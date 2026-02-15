export type MongoCollections = "documents" | "expenses" | "subscriptions" | "token_ledger";

export type IndexDirection = 1 | -1;

export interface CollectionIndexSpec {
  key: Record<string, IndexDirection>;
  name: string;
  unique?: boolean;
}

const COLLECTION_INDEXES: Record<MongoCollections, CollectionIndexSpec[]> = {
  documents: [
    { name: "idx_documents_workspace_uploaded_at", key: { workspace_id: 1, uploaded_at: -1 } },
  ],
  expenses: [
    { name: "idx_expenses_workspace_created_at", key: { workspace_id: 1, created_at: -1 } },
    { name: "idx_expenses_workspace_status_created_at", key: { workspace_id: 1, status: 1, created_at: -1 } },
    { name: "uq_expenses_workspace_external_ref", key: { workspace_id: 1, external_ref: 1 }, unique: true },
  ],
  subscriptions: [{ name: "uq_subscriptions_workspace", key: { workspace_id: 1 }, unique: true }],
  token_ledger: [{ name: "idx_token_ledger_workspace_created_at", key: { workspace_id: 1, created_at: -1 } }],
};

export function collectionName(name: MongoCollections): string {
  return name;
}

export function getCollectionIndexes(name: MongoCollections): CollectionIndexSpec[] {
  return COLLECTION_INDEXES[name];
}
