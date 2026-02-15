import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../lib/ui/card";
import { Button } from "../lib/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const stats = [
  { name: "Automated approvals", value: "86%" },
  { name: "Policies enforced", value: "94%" },
  { name: "Monthly spend visibility", value: "100%" }
];

export function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-title">
      <header className="page-header">
        <h2 id="dashboard-title">Dashboard</h2>
        <p className="page-subtitle">
          Monitor ingestion, policy checks, and reimbursement throughput from one workspace.
        </p>
      </header>
      <div className="grid-cards">
        {stats.map((stat) => (
          <Card key={stat.name} tone="accent">
            <CardHeader>
              <CardTitle>{stat.value}</CardTitle>
              <CardDescription>{stat.name}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Platform wiring</CardTitle>
          <CardDescription>Frontend configured to call backend API base URL.</CardDescription>
        </CardHeader>
        <CardContent className="row">
          <code>{API_BASE_URL}</code>
          <Button size="sm">Create automation rule</Button>
        </CardContent>
      </Card>
    </section>
  );
}
