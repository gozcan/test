import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPlanLimits(plan) {
  const table = {
    starter: { includedSeats: 3, monthlyAiTokens: 1000 },
    growth: { includedSeats: 10, monthlyAiTokens: 10000 },
  };
  return table[plan];
}

function canUseExtraction({ usedTokens, requestedTokens, monthlyAiTokens }) {
  return usedTokens + requestedTokens <= monthlyAiTokens;
}

function mapReceiptToDraftExpense(receipt) {
  return {
    vendorName: String(receipt.vendor || "").trim(),
    amountCents: Math.round(Number(receipt.amount) * 100),
    currency: receipt.currency,
    incurredOn: receipt.date,
    status: "draft",
  };
}

test("starter plan reserves 3 included seats", () => {
  const starter = getPlanLimits("starter");
  assert.equal(starter.includedSeats, 3);
});

test("ai extraction is blocked when token budget would be exceeded", () => {
  const growth = getPlanLimits("growth");
  const allowed = canUseExtraction({
    usedTokens: 9500,
    requestedTokens: 400,
    monthlyAiTokens: growth.monthlyAiTokens,
  });
  const blocked = canUseExtraction({
    usedTokens: 9800,
    requestedTokens: 300,
    monthlyAiTokens: growth.monthlyAiTokens,
  });
  assert.equal(allowed, true);
  assert.equal(blocked, false);
});

test("receipt fixture is normalized into a draft expense shape", () => {
  const fixturePath = path.join(__dirname, "../../fixtures/sample-receipt.json");
  const raw = fs.readFileSync(fixturePath, "utf8");
  const receipt = JSON.parse(raw.replace(/^\uFEFF/, ""));
  const draft = mapReceiptToDraftExpense(receipt);

  assert.deepEqual(draft, {
    vendorName: "Sample Vendor",
    amountCents: 4250,
    currency: "USD",
    incurredOn: "2026-02-15",
    status: "draft",
  });
});