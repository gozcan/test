import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readText } from "../helpers/load-ts-module.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("billing routes wire subscription and performance guardrails endpoints", () => {
  const billingRoutePath = path.resolve(__dirname, "../../../api/routes/billing.ts");
  const source = readText(billingRoutePath);

  assert.match(source, /app\.get\("\/api\/billing\/subscription"/);
  assert.match(source, /res\.json\(getSubscriptionSnapshot\(\)\)/);
  assert.match(source, /app\.get\("\/api\/billing\/performance\/guardrails"/);
});

test("app wires billing latency middleware for performance sampling", () => {
  const appPath = path.resolve(__dirname, "../../app.ts");
  const source = readText(appPath);

  assert.match(source, /app\.use\(billingLatencyMiddleware\)/);
  assert.match(source, /registerBillingRoutes\(app\)/);
});

test("subscription endpoint handler remains synchronous and IO-free", () => {
  const billingRoutePath = path.resolve(__dirname, "../../../api/routes/billing.ts");
  const source = readText(billingRoutePath);

  assert.doesNotMatch(source, /app\.get\("\/api\/billing\/subscription"[\s\S]*?\bawait\b/);
  assert.doesNotMatch(source, /app\.get\("\/api\/billing\/subscription"[\s\S]*?\bfetch\b/);
  assert.doesNotMatch(source, /app\.get\("\/api\/billing\/subscription"[\s\S]*?\bsetTimeout\b/);
});