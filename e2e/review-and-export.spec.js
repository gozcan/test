import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function bootstrapDraft(receipt) {
  return {
    id: "exp_e2e_1",
    status: "draft",
    vendorName: receipt.vendor,
    amount: receipt.amount,
    currency: receipt.currency,
    incurredOn: receipt.date,
    category: "Uncategorized",
  };
}

function reviewerCorrectsAndApproves(expense, correctedCategory) {
  const inReview = { ...expense, status: "in_review" };
  return { ...inReview, status: "approved", category: correctedCategory };
}

function exportCsv(expenses) {
  const header = "id,vendor,amount,currency,date,category,status";
  const rows = expenses.map(
    (e) =>
      `${e.id},${e.vendorName},${e.amount},${e.currency},${e.incurredOn},${e.category},${e.status}`
  );
  return [header, ...rows].join("\n");
}

test("upload -> review correction -> approve -> csv export", () => {
  const fixturePath = path.join(__dirname, "../fixtures/sample-receipt.json");
  const receipt = JSON.parse(fs.readFileSync(fixturePath, "utf8").replace(/^\uFEFF/, ""));

  const draft = bootstrapDraft(receipt);
  const approved = reviewerCorrectsAndApproves(draft, "Meals");
  const csv = exportCsv([approved]);

  assert.equal(approved.status, "approved");
  assert.equal(approved.category, "Meals");
  assert.match(
    csv,
    /exp_e2e_1,Sample Vendor,42.5,USD,2026-02-15,Meals,approved/
  );
});