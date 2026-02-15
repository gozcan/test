"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
function toIsoDate(now) {
    return now.toISOString();
}
function csvEscape(input) {
    if (input.includes(",") || input.includes("\"") || input.includes("\n")) {
        return `"${input.replace(/"/g, "\"\"")}"`;
    }
    return input;
}
class ExpenseService {
    repo;
    generateId;
    now;
    constructor(repo, generateId = () => `exp_${Date.now()}`, now = () => new Date()) {
        this.repo = repo;
        this.generateId = generateId;
        this.now = now;
    }
    async createDraft(input) {
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
    async exportApprovedCsv(workspaceId) {
        const rows = await this.repo.listByStatus(workspaceId, "approved");
        const lines = rows.map((row) => `${csvEscape(row.vendor)},${row.amount.toFixed(2)},${row.status}`);
        return ["vendor,amount,status", ...lines].join("\n");
    }
}
exports.ExpenseService = ExpenseService;
