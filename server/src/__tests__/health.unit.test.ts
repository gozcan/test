import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";

describe("api app", () => {
  it("mounts health route", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
  });
});
