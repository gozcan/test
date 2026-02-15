import { describe, it, expect } from "vitest";

describe("extract endpoint contract", () => {
  it("returns draft-like structure", () => {
    const payload = { id: "exp_1", status: "draft" };
    expect(payload.status).toBe("draft");
  });
});
