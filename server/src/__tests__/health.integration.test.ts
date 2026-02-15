import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";

describe("health endpoint", () => {
  it("returns API service status", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("expense-automation-api");
    expect(typeof response.body.timestamp).toBe("string");
  });
});
