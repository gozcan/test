import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { readText, loadFunctionFromTs } from "../tests/helpers/load-ts-function.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("app wires billing routes for end-to-end availability", () => {
  const appPath = path.resolve(__dirname, "../src/server/app.ts");
  const source = readText(appPath);

  assert.match(source, /registerBillingRoutes\(app\)/);
  assert.match(source, /app\.get\("\/health"/);
});

test("subscription snapshot computation remains within MVP performance budget", () => {
  const servicePath = path.resolve(__dirname, "../src/services/subscription.service.ts");
  const source = readText(servicePath);
  const getSubscriptionSnapshot = loadFunctionFromTs(servicePath, "getSubscriptionSnapshot");

  assert.doesNotMatch(source, /\bDate\.now\b/);
  assert.doesNotMatch(source, /\bMath\.random\b/);
  assert.doesNotMatch(source, /\bawait\b/);

  const iterations = 50000;
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) {
    getSubscriptionSnapshot();
  }
  const durationMs = performance.now() - start;

  assert.ok(durationMs < 1000, `Expected <1000ms for ${iterations} iterations, got ${durationMs.toFixed(2)}ms`);
});
