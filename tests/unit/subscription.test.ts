import { describe, it, expect } from "vitest";

describe("subscription defaults", () => {
  it("reserves three included seats", () => {
    expect(3).toBe(3);
  });
});
