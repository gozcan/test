"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpenseDraftFromDocument = createExpenseDraftFromDocument;
async function createExpenseDraftFromDocument(expenseService, input) {
    return expenseService.createDraft(input);
}
