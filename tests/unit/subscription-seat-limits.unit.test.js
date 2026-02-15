import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const subscriptionServicePath = path.resolve(
  process.cwd(),
  "src/services/subscription.service.ts",
);

function readSubscriptionService() {
  return fs.readFileSync(subscriptionServicePath, "utf8");
}

test("subscription snapshot defines seat fields", () => {
  const source = readSubscriptionService();
  assert.match(source, /included_seats\s*:/, "included_seats is required");
  assert.match(source, /seats_used\s*:/, "seats_used is required");
  assert.match(
    source,
    /can_purchase_extra_seats\s*:\s*(true|false)/,
    "can_purchase_extra_seats is required",
  );
});

test("starter seat usage does not exceed included seats", () => {
  const source = readSubscriptionService();
  const includedMatch = source.match(/included_seats\s*:\s*(\d+)/);
  const usedMatch = source.match(/seats_used\s*:\s*(\d+)/);

  assert.ok(includedMatch, "included_seats numeric value was not found");
  assert.ok(usedMatch, "seats_used numeric value was not found");

  const includedSeats = Number(includedMatch[1]);
  const seatsUsed = Number(usedMatch[1]);
  assert.ok(
    seatsUsed <= includedSeats,
    `seats_used (${seatsUsed}) must be <= included_seats (${includedSeats})`,
  );
});
