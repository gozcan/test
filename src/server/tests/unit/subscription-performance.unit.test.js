import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { loadFunctionsFromTs } from "../helpers/load-ts-module.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("subscription snapshot contract remains deterministic for token and seat add-ons", () => {
  const servicePath = path.resolve(__dirname, "../../../services/subscription.service.ts");
  const source = loadFunctionsFromTs(servicePath, ["getSubscriptionSnapshot"]);

  const snapshot = source.getSubscriptionSnapshot();

  assert.equal(snapshot.plan, "starter");
  assert.equal(snapshot.included_tokens_monthly, 100000);
  assert.equal(snapshot.tokens_used, 0);
  assert.equal(snapshot.included_seats, 3);
  assert.equal(snapshot.seats_used, 1);
  assert.equal(snapshot.can_purchase_extra_tokens, true);
  assert.equal(snapshot.can_purchase_extra_seats, true);
});

test("subscription snapshot retrieval remains under MVP performance budget", () => {
  const servicePath = path.resolve(__dirname, "../../../services/subscription.service.ts");
  const source = loadFunctionsFromTs(servicePath, ["getSubscriptionSnapshot"]);

  const iterations = 50000;
  const startedAt = performance.now();

  for (let i = 0; i < iterations; i += 1) {
    source.getSubscriptionSnapshot();
  }

  const elapsedMs = performance.now() - startedAt;
  assert.ok(elapsedMs < 1000, `Expected <1000ms for ${iterations} iterations, got ${elapsedMs.toFixed(2)}ms`);
});