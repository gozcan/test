export type MongoCollections =
  | "documents"
  | "expenses"
  | "subscriptions"
  | "token_ledger"
  | "workflow_runs";

export function collectionName(name: MongoCollections): string {
  return name;
}
