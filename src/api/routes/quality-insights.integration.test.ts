import test from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { createApp } from "../../server/app";

async function withServer<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
  const app = createApp();
  const server = app.listen(0);
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    return await run(baseUrl);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

test("GET /api/insights/quality returns aggregate metrics", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/insights/quality`);
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.deepEqual(payload.summary, {
      total_runs: 7,
      failed_runs: 2,
      retry_count: 7,
      completion_rate: 71.43,
    });
    assert.equal(payload.by_workflow.length, 3);
  });
});

test("GET /api/insights/quality filters by date and workflow_type", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/insights/quality?start_date=2026-02-01&end_date=2026-02-28&workflow_type=policy_check`,
    );
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.deepEqual(payload.summary, {
      total_runs: 2,
      failed_runs: 1,
      retry_count: 5,
      completion_rate: 50,
    });
    assert.equal(payload.by_workflow.find((workflow: { workflow_type: string }) => workflow.workflow_type === "policy_check").total_runs, 2);
  });
});

test("GET /api/insights/quality returns 400 on invalid date format", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/insights/quality?start_date=02-01-2026`);
    assert.equal(response.status, 400);

    const payload = await response.json();
    assert.equal(payload.error.code, "VALIDATION_ERROR");
    assert.equal(Array.isArray(payload.error.details), true);
  });
});

test("GET /api/insights/quality returns 400 when date range is reversed", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/insights/quality?start_date=2026-02-15&end_date=2026-02-01`);
    assert.equal(response.status, 400);

    const payload = await response.json();
    assert.equal(payload.error.code, "VALIDATION_ERROR");
    assert.equal(payload.error.details[0], "start_date must be before or equal to end_date.");
  });
});

test("GET /api/insights/quality returns 400 on invalid workflow_type", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/insights/quality?workflow_type=invalid_flow`);
    assert.equal(response.status, 400);

    const payload = await response.json();
    assert.equal(payload.error.code, "VALIDATION_ERROR");
  });
});
