import { Button } from "../lib/ui/button";

export function ReceiptUploadCard() {
  return (
    <section style={{ background: "white", borderRadius: 14, padding: 20 }}>
      <h2>Upload Receipts/Invoices</h2>
      <p>Drop PDF/JPG/PNG files. They will be queued for AI extraction.</p>
      <Button type="button">Upload Files</Button>
    </section>
  );
}
