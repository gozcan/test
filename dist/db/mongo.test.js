"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("./mongo");
describe("mongo collection metadata", () => {
    it("returns stable expense collection name", () => {
        expect((0, mongo_1.collectionName)("expenses")).toBe("expenses");
    });
    it("defines required indexes for expenses collection", () => {
        const indexes = (0, mongo_1.getCollectionIndexes)("expenses");
        expect(indexes.find((idx) => idx.name === "idx_expenses_workspace_created_at")).toBeTruthy();
        expect(indexes.find((idx) => idx.name === "idx_expenses_workspace_status_created_at")).toBeTruthy();
        expect(indexes.find((idx) => idx.name === "uq_expenses_workspace_external_ref")?.unique).toBe(true);
    });
});
