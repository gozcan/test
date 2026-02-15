"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryExpenseRepository = void 0;
class InMemoryExpenseRepository {
    items = new Map();
    async createDraft(input) {
        const doc = {
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
    async listByStatus(workspaceId, status) {
        const rows = [];
        for (const value of this.items.values()) {
            if (value.workspace_id === workspaceId && value.status === status) {
                rows.push(value);
            }
        }
        return rows;
    }
}
exports.InMemoryExpenseRepository = InMemoryExpenseRepository;
