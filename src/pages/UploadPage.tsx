import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../lib/ui/card";
import { Button } from "../lib/ui/button";

export function UploadPage() {
  return (
    <section aria-labelledby="upload-title">
      <header className="page-header">
        <h2 id="upload-title">Upload</h2>
        <p className="page-subtitle">Upload receipts and invoices to seed extraction and approval automation.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Upload queue</CardTitle>
          <CardDescription>Placeholder route for file upload and ingestion controls.</CardDescription>
        </CardHeader>
        <CardContent className="row">
          <p className="upload-placeholder">Drag-and-drop ingestion will be connected in the next iteration.</p>
          <Button variant="secondary">Upload files</Button>
        </CardContent>
      </Card>
    </section>
  );
}
