import "../styles/app.css";
import { ReceiptUploadCard } from "../components/ReceiptUploadCard";
import { ExpenseReviewTable } from "../components/ExpenseReviewTable";
import { BillingSummaryCard } from "../components/BillingSummaryCard";

export function OperationsPage() {
  return (
    <main className="page-shell">
      <h1>Expense Automation Workspace</h1>
      <p>AI extraction + approval workflow + CSV export.</p>
      <ReceiptUploadCard />
      <ExpenseReviewTable />
      <BillingSummaryCard />
    </main>
  );
}
