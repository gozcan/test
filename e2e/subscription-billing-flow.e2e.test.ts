import { afterEach, describe, expect, it, vi } from "vitest";
import { registerBillingRoutes } from "../src/api/routes/billing";
import { registerExpenseRoutes } from "../src/api/routes/expenses";

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

describe("subscription billing e2e flow", () => {
  it("supports billing snapshot, extraction draft creation, and CSV export in one journey", async () => {
    const app = createMockApp();
    registerBillingRoutes(app as never);
    registerExpenseRoutes(app as never);

    const billingResponse = await app.invoke("GET", "/api/billing/subscription");
    expect(billingResponse.statusCode).toBe(200);
    expect(billingResponse.body).toMatchObject({
      included_tokens_monthly: 100000,
      included_seats: 3,
      can_purchase_extra_tokens: true,
      can_purchase_extra_seats: true,
    });

    vi.spyOn(Date, "now").mockReturnValue(1735689600000);
    const extractResponse = await app.invoke("POST", "/api/documents/extract", {
      body: { vendor: "Northwind", amount: 42.5 },
    });

    expect(extractResponse.statusCode).toBe(201);
    expect(extractResponse.body).toEqual({
      id: "exp_1735689600000",
      vendor: "Northwind",
      amount: 42.5,
      currency: "USD",
      status: "draft",
      source: "chatgpt-mini0-batch",
    });

    const exportResponse = await app.invoke("GET", "/api/expenses/export.csv");
    expect(exportResponse.statusCode).toBe(200);
    expect(exportResponse.headers["content-type"]).toBe("text/csv");
    expect(exportResponse.body).toBe("vendor,amount,status\nSample Vendor,42.50,approved\n");
  });
});
