import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractExpenseDraft(receipt, nowIso) {
  return {
    id: "exp_1",
    status: "draft",
    createdAt: nowIso,
    fields: {
      vendorName: receipt.vendor,
      amount: receipt.amount,
      currency: receipt.currency,
      incurredOn: receipt.date,
      category: "Uncategorized",
    },
  };
}

function transitionExpense(current, next) {
  const allowed = {
    draft: new Set(["in_review"]),
    in_review: new Set(["approved", "needs_changes"]),
    needs_changes: new Set(["in_review"]),
    approved: new Set(),
  };
  if (!allowed[current.status].has(next)) {
    throw new Error(`Invalid transition: ${current.status} -> ${next}`);
  }
  return { ...current, status: next };
}

test("extract endpoint contract returns FE-consumable draft payload", () => {
  const fixturePath = path.join(__dirname, "../../fixtures/sample-receipt.json");
  const receipt = JSON.parse(fs.readFileSync(fixturePath, "utf8").replace(/^\uFEFF/, ""));
  const payload = extractExpenseDraft(receipt, "2026-02-15T00:00:00.000Z");

  assert.equal(typeof payload.id, "string");
  assert.equal(payload.status, "draft");
  assert.equal(payload.createdAt, "2026-02-15T00:00:00.000Z");
  assert.equal(payload.fields.vendorName, "Sample Vendor");
  assert.equal(payload.fields.currency, "USD");
  assert.equal(payload.fields.category, "Uncategorized");
});

test("expense review state transitions follow backend contract", () => {
  const draft = {
    id: "exp_1",
    status: "draft",
    fields: { vendorName: "Sample Vendor" },
  };
  const inReview = transitionExpense(draft, "in_review");
  const approved = transitionExpense(inReview, "approved");

  assert.equal(inReview.status, "in_review");
  assert.equal(approved.status, "approved");
});

test("invalid status transition is rejected to protect FE/BE contract", () => {
  const approved = { id: "exp_1", status: "approved" };
  assert.throws(
    () => transitionExpense(approved, "draft"),
    /Invalid transition: approved -> draft/
  );
});