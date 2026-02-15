import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readText } from "../helpers/load-ts-function.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("billing route registers subscription endpoint contract path", () => {
  const billingRoutePath = path.resolve(__dirname, "../../src/api/routes/billing.ts");
  const source = readText(billingRoutePath);

  assert.match(source, /app\.get\("\/api\/billing\/subscription"/);
  assert.match(source, /res\.json\(getSubscriptionSnapshot\(\)\)/);
});

test("billing route is synchronous and IO-free for performance guardrails", () => {
  const billingRoutePath = path.resolve(__dirname, "../../src/api/routes/billing.ts");
  const source = readText(billingRoutePath);

  assert.doesNotMatch(source, /\bawait\b/);
  assert.doesNotMatch(source, /\bsetTimeout\b/);
  assert.doesNotMatch(source, /\bfetch\b/);
  assert.doesNotMatch(source, /\bcollectionName\b/);
  assert.doesNotMatch(source, /\bmongo\b/i);
});
