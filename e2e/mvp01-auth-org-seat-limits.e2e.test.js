import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const routeFiles = [
  "src/server/app.ts",
  "src/api/routes/billing.ts",
  "src/api/routes/expenses.ts",
];

function loadRouteSource() {
  return routeFiles
    .map((file) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8"))
    .join("\n");
}

test("MVP-01 journey exposes auth endpoints", () => {
  const source = loadRouteSource();
  assert.match(
    source,
    /\/api\/auth\/(login|signin|session)/i,
    "expected an auth endpoint for session establishment",
  );
});

test("MVP-01 journey exposes organization-scoped APIs", () => {
  const source = loadRouteSource();
  assert.match(
    source,
    /(\/api\/organizations?|orgId|organizationId|tenantId)/i,
    "expected organization endpoint or organization-scoped route params",
  );
});

test("MVP-01 journey applies seat checks to protected write paths", () => {
  const source = loadRouteSource();
  assert.match(
    source,
    /(seat.*(check|limit|enforce)|limit.*seat)/i,
    "expected seat limit checks in protected flow",
  );
});
