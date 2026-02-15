import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerBillingRoutes } from "../../src/api/routes/billing";
import { registerExpenseRoutes } from "../../src/api/routes/expenses";

type Handler = (req: Record<string, unknown>, res: ReturnType<typeof createMockResponse>) => unknown;

function createMockApp() {
  const routes = new Map<string, Handler>();

  return {
    get(path: string, handler: Handler) {
      routes.set(`GET ${path}`, handler);
    },
    post(path: string, handler: Handler) {
      routes.set(`POST ${path}`, handler);
    },
    async invoke(method: "GET" | "POST", path: string, req: Record<string, unknown> = {}) {
      const key = `${method} ${path}`;
      const handler = routes.get(key);
      if (!handler) {
        throw new Error(`Route not registered: ${key}`);
      }
      const res = createMockResponse();
      await handler(req, res);
      return res;
    },
  };
}

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    header(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    send(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("billing and extraction API contracts", () => {
  it("GET /api/billing/subscription returns token+seat add-on billing fields", async () => {
    const app = createMockApp();
    registerBillingRoutes(app as never);

    const response = await app.invoke("GET", "/api/billing/subscription");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      plan: "starter",
      included_tokens_monthly: 100000,
      tokens_used: 0,
      included_seats: 3,
      seats_used: 1,
      can_purchase_extra_tokens: true,
      can_purchase_extra_seats: true,
    });
  });

  it("POST /api/documents/extract returns a draft expense contract", async () => {
    const app = createMockApp();
    registerExpenseRoutes(app as never);

    vi.spyOn(Date, "now").mockReturnValue(1735689600000);
    const fixtureRaw = readFileSync("fixtures/documents/extract-input.json", "utf-8");
    const payload = JSON.parse(fixtureRaw);

    const response = await app.invoke("POST", "/api/documents/extract", { body: payload });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: "exp_1735689600000",
      vendor: "Contoso Travel",
      amount: 123.45,
      currency: "USD",
      status: "draft",
      source: "chatgpt-mini0-batch",
    });
  });
});
