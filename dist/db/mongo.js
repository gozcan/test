"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionName = collectionName;
exports.getCollectionIndexes = getCollectionIndexes;
const COLLECTION_INDEXES = {
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
function collectionName(name) {
    return name;
}
function getCollectionIndexes(name) {
    return COLLECTION_INDEXES[name];
}
