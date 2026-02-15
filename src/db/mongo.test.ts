import { collectionName, getCollectionIndexes } from "./mongo";

describe("mongo collection metadata", () => {
  it("returns stable expense collection name", () => {
    expect(collectionName("expenses")).toBe("expenses");
  });

  it("defines required indexes for expenses collection", () => {
    const indexes = getCollectionIndexes("expenses");

    expect(indexes.find((idx) => idx.name === "idx_expenses_workspace_created_at")).toBeTruthy();
    expect(indexes.find((idx) => idx.name === "idx_expenses_workspace_status_created_at")).toBeTruthy();
    expect(indexes.find((idx) => idx.name === "uq_expenses_workspace_external_ref")?.unique).toBe(true);
  });
});
