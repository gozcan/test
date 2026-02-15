import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../lib/ui/card";
import { Button } from "../lib/ui/button";

const queuedExpenses = [
  { merchant: "Delta Air Lines", amount: "$420.19", status: "Needs receipt" },
  { merchant: "Uber", amount: "$42.10", status: "Policy review" },
  { merchant: "Marriott", amount: "$680.00", status: "Ready to reimburse" }
];

export function ExpensesPage() {
  return (
    <section aria-labelledby="expenses-title">
      <header className="page-header">
        <h2 id="expenses-title">Expense Inbox</h2>
        <p className="page-subtitle">
          Review and automate incoming expense events before they hit payroll.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Expense queue</CardTitle>
          <CardDescription>Records waiting for policy or receipt completion.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="expense-list" aria-label="Expense queue list">
            {queuedExpenses.map((expense) => (
              <li key={`${expense.merchant}-${expense.amount}`}>
                <div>
                  <p className="expense-merchant">{expense.merchant}</p>
                  <p className="expense-status">{expense.status}</p>
                </div>
                <strong>{expense.amount}</strong>
              </li>
            ))}
          </ul>
          <Button variant="secondary">Upload receipts</Button>
        </CardContent>
      </Card>
    </section>
  );
}
