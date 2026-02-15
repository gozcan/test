import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { loadFunctionsFromTs } from "../helpers/load-ts-module.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadServiceModule() {
  const servicePath = path.resolve(__dirname, "../../../services/billing-performance.service.ts");
  return loadFunctionsFromTs(servicePath, [
    "recordBillingLatencySample",
    "getBillingPerformanceGuardrails",
    "resetBillingPerformanceSamples",
  ]);
}

test("billing performance service enforces sample cap and computes percentile stats", () => {
  const service = loadServiceModule();
  service.resetBillingPerformanceSamples();

  for (let i = 1; i <= 700; i += 1) {
    service.recordBillingLatencySample("/api/billing/subscription", i, 200);
  }

  const report = service.getBillingPerformanceGuardrails(500);
  const endpoint = report.endpoints.find((item) => item.endpoint === "/api/billing/subscription");

  assert.equal(report.window_size, 500);
  assert.ok(endpoint);
  assert.equal(endpoint.sample_count, 500);
  assert.equal(endpoint.max_ms, 700);
  assert.equal(endpoint.over_budget, true);
});

test("billing performance report window validation fallback keeps bounded defaults", () => {
  const service = loadServiceModule();
  service.resetBillingPerformanceSamples();

  service.recordBillingLatencySample("/api/billing/subscription", 10, 200);
  const report = service.getBillingPerformanceGuardrails(-1);

  assert.equal(report.window_size, 500);
  assert.equal(report.endpoints[0].sample_count, 1);
});

test("billing performance report generation remains within MVP smoke budget", () => {
  const service = loadServiceModule();
  service.resetBillingPerformanceSamples();

  for (let i = 0; i < 500; i += 1) {
    service.recordBillingLatencySample("/api/billing/subscription", 12, 200);
  }

  const iterations = 10000;
  const startedAt = performance.now();
  for (let i = 0; i < iterations; i += 1) {
    service.getBillingPerformanceGuardrails(300);
  }
  const elapsedMs = performance.now() - startedAt;

  assert.ok(elapsedMs < 1000, `Expected <1000ms for ${iterations} report generations, got ${elapsedMs.toFixed(2)}ms`);
});