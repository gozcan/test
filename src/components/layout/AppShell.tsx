import { Outlet } from "react-router-dom";
import { SidebarNav } from "../navigation/SidebarNav";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header" role="banner">
        <div>
          <p className="app-kicker">Expense automation platform</p>
          <h1>Expense Automation SaaS</h1>
        </div>
      </header>
      <div className="app-body">
        <SidebarNav />
        <main className="app-main" aria-live="polite" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
