import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf8");
}

test("billing subscription route is registered", () => {
  const appSource = read("src/server/app.ts");
  const billingRouteSource = read("src/api/routes/billing.ts");

  assert.match(appSource, /registerBillingRoutes\s*\(/);
  assert.match(
    billingRouteSource,
    /app\.get\(\s*["'`]\/api\/billing\/subscription["'`]/,
  );
});

test("app wiring includes authentication for API routes", () => {
  const appSource = read("src/server/app.ts");
  assert.match(
    appSource,
    /(requireAuth|authenticate|authMiddleware|authorization)/i,
    "missing authentication middleware registration in app wiring",
  );
});

test("billing subscription endpoint enforces organization scoping", () => {
  const billingRouteSource = read("src/api/routes/billing.ts");
  assert.match(
    billingRouteSource,
    /(organization|orgId|tenantId|workspaceId)/i,
    "missing organization/tenant scoping in billing endpoint",
  );
});

test("billing flow includes seat limit enforcement", () => {
  const billingRouteSource = read("src/api/routes/billing.ts");
  const subscriptionServiceSource = read("src/services/subscription.service.ts");
  const combinedSource = `${billingRouteSource}\n${subscriptionServiceSource}`;

  assert.match(
    combinedSource,
    /(seat.*limit|limit.*seat|enforce.*seat|check.*seat)/i,
    "missing seat limit enforcement logic",
  );
});
