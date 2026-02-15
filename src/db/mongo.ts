export type MongoCollections = "documents" | "expenses" | "subscriptions" | "token_ledger";

export function collectionName(name: MongoCollections): string {
  return name;
}
