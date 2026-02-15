import { test, expect } from "@playwright/test";

test("review flow placeholder", async ({ page }) => {
  await page.goto("about:blank");
  await expect(page).toHaveURL("about:blank");
});
