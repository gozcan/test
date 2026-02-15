export type MongoCollections =
  | "documents"
  | "expenses"
  | "subscriptions"
  | "token_ledger"
  | "billing_performance_samples";

export type MongoIndexDefinition = {
  key: Record<string, 1 | -1>;
  name: string;
  unique?: boolean;
  expireAfterSeconds?: number;
};

const INDEXES_BY_COLLECTION: Record<MongoCollections, MongoIndexDefinition[]> = {
  documents: [],
  expenses: [
    { key: { workspace_id: 1, created_at: -1 }, name: "expenses_workspace_created_at" },
  ],
  subscriptions: [
    { key: { workspace_id: 1 }, name: "subscriptions_workspace_unique", unique: true },
    { key: { updated_at: -1 }, name: "subscriptions_updated_at" },
  ],
  token_ledger: [
    { key: { workspace_id: 1, created_at: -1 }, name: "token_ledger_workspace_created_at" },
  ],
  billing_performance_samples: [
    { key: { endpoint: 1, recorded_at: -1 }, name: "billing_perf_endpoint_recorded_at" },
    {
      key: { recorded_at: 1 },
      name: "billing_perf_recorded_at_ttl",
      expireAfterSeconds: 60 * 60 * 24 * 7,
    },
  ],
};

export function collectionName(name: MongoCollections): string {
  return name;
}

export function collectionIndexes(name: MongoCollections): MongoIndexDefinition[] {
  return INDEXES_BY_COLLECTION[name];
}