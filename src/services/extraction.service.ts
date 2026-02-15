import type { CreateExpenseDraftRequest, ExpenseDraftResponse } from "../api/contracts/expenses";
import type { ExpenseService } from "./expense.service";

export async function createExpenseDraftFromDocument(
  expenseService: ExpenseService,
  input: CreateExpenseDraftRequest,
): Promise<ExpenseDraftResponse> {
  return expenseService.createDraft(input);
}
