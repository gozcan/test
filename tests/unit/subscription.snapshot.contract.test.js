import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { loadFunctionFromTs } from "../helpers/load-ts-function.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("subscription snapshot matches FE/BE contract fixture", () => {
  const fixturePath = path.resolve(__dirname, "../../fixtures/billing/subscription-snapshot.json");
  const servicePath = path.resolve(__dirname, "../../src/services/subscription.service.ts");
  const expected = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const getSubscriptionSnapshot = loadFunctionFromTs(servicePath, "getSubscriptionSnapshot");

  const actual = getSubscriptionSnapshot();
  assert.equal(JSON.stringify(actual), JSON.stringify(expected));
});

test("subscription snapshot has token and seat add-on fields", () => {
  const servicePath = path.resolve(__dirname, "../../src/services/subscription.service.ts");
  const getSubscriptionSnapshot = loadFunctionFromTs(servicePath, "getSubscriptionSnapshot");
  const snapshot = getSubscriptionSnapshot();

  assert.equal(typeof snapshot.included_tokens_monthly, "number");
  assert.equal(typeof snapshot.tokens_used, "number");
  assert.equal(typeof snapshot.included_seats, "number");
  assert.equal(typeof snapshot.seats_used, "number");
  assert.equal(snapshot.can_purchase_extra_tokens, true);
  assert.equal(snapshot.can_purchase_extra_seats, true);
});
