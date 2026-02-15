import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { createApp } from "../../server/app";

async function withServer(run: (baseUrl: string) => Promise<void>) {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

test("GET /api/billing/subscription returns default snapshot", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/billing/subscription`, {
      headers: { "x-org-id": "org-default-snapshot" },
    });
    assert.equal(response.status, 200);

    const payload = (await response.json()) as { included_tokens_monthly: number; included_seats: number };
    assert.equal(payload.included_tokens_monthly, 100000);
    assert.equal(payload.included_seats, 3);
  });
});

test("POST /api/billing/onboarding/quote validates payload", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/billing/onboarding/quote`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-org-id": "org-invalid-quote" },
      body: JSON.stringify({ expected_tokens_monthly: -1, expected_seats: 2 }),
    });

    assert.equal(response.status, 400);
    const payload = (await response.json()) as { error: { code: string } };
    assert.equal(payload.error.code, "VALIDATION_ERROR");
  });
});

test("POST /api/billing/onboarding/quote returns recommendation", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/billing/onboarding/quote`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-org-id": "org-quote-reco" },
      body: JSON.stringify({ expected_tokens_monthly: 260000, expected_seats: 5 }),
    });

    assert.equal(response.status, 200);
    const payload = (await response.json()) as {
      recommended_token_addon_units: number;
      recommended_seat_addon_units: number;
      estimated_monthly_cost_usd: number;
    };
    assert.equal(payload.recommended_token_addon_units, 4);
    assert.equal(payload.recommended_seat_addon_units, 2);
    assert.equal(payload.estimated_monthly_cost_usd, 110);
  });
});

test("POST /api/billing/addons/purchase applies token and seat add-ons", async () => {
  await withServer(async (baseUrl) => {
    const orgId = "org-addon-purchase";

    const buyTokens = await fetch(`${baseUrl}/api/billing/addons/purchase`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-org-id": orgId },
      body: JSON.stringify({ addon_type: "tokens", quantity: 2 }),
    });
    assert.equal(buyTokens.status, 201);

    const buySeat = await fetch(`${baseUrl}/api/billing/addons/purchase`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-org-id": orgId },
      body: JSON.stringify({ addon_type: "seats", quantity: 1 }),
    });
    assert.equal(buySeat.status, 201);

    const subscription = await fetch(`${baseUrl}/api/billing/subscription`, {
      headers: { "x-org-id": orgId },
    });
    const payload = (await subscription.json()) as {
      addon_tokens_purchased: number;
      addon_seats_purchased: number;
      token_balance_available: number;
      seat_capacity_available: number;
    };

    assert.equal(payload.addon_tokens_purchased, 100000);
    assert.equal(payload.addon_seats_purchased, 1);
    assert.equal(payload.token_balance_available, 200000);
    assert.equal(payload.seat_capacity_available, 3);
  });
});

test("POST /api/billing/addons/purchase rejects invalid quantity", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/billing/addons/purchase`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-org-id": "org-invalid-addon" },
      body: JSON.stringify({ addon_type: "tokens", quantity: 0 }),
    });
    assert.equal(response.status, 400);
  });
});
