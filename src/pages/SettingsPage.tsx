import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../lib/ui/card";
import { Button } from "../lib/ui/button";

export function SettingsPage() {
  return (
    <section aria-labelledby="settings-title">
      <header className="page-header">
        <h2 id="settings-title">Settings</h2>
        <p className="page-subtitle">Configure policy controls and automation defaults for your workspace.</p>
      </header>
      <div className="grid-cards">
        <Card>
          <CardHeader>
            <CardTitle>Approval thresholds</CardTitle>
            <CardDescription>Auto-approve expenses below a configurable limit.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="setting-highlight">$250 default threshold</p>
            <Button size="sm">Adjust threshold</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Receipts policy</CardTitle>
            <CardDescription>Choose when receipt uploads are mandatory.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="setting-highlight">Required above $75</p>
            <Button size="sm" variant="secondary">
              Edit policy
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
