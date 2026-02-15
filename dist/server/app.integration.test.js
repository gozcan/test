"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("./app");
describe("API integration", () => {
    it("creates draft from extract payload", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).post("/api/documents/extract").send({
            workspace_id: "ws_123",
            vendor: "Acme Flights",
            amount: 42.5,
            currency: "USD",
        });
        expect(response.status).toBe(201);
        expect(response.body.workspace_id).toBe("ws_123");
        expect(response.body.vendor).toBe("Acme Flights");
        expect(response.body.status).toBe("draft");
        expect(response.headers["x-request-id"]).toBeTruthy();
    });
    it("returns validation error on invalid extract payload", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).post("/api/documents/extract").send({
            workspace_id: "",
            amount: -1,
        });
        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(Array.isArray(response.body.error.details)).toBe(true);
    });
    it("exports csv for approved expenses", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/api/expenses/export.csv").query({
            workspace_id: "ws_123",
        });
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toContain("text/csv");
        expect(response.text).toContain("vendor,amount,status");
    });
    it("returns validation error when workspace_id is missing for csv export", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/api/expenses/export.csv");
        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    it("returns current billing subscription snapshot", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/api/billing/subscription");
        expect(response.status).toBe(200);
        expect(response.body.plan).toBe("starter");
        expect(response.body.included_tokens_monthly).toBeGreaterThan(0);
    });
    it("returns 404 response envelope for unknown route", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/unknown");
        expect(response.status).toBe(404);
        expect(response.body.error.code).toBe("NOT_FOUND");
        expect(response.body.request_id).toBeTruthy();
    });
});
