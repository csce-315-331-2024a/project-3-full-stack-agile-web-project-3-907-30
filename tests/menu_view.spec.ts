import { test, expect } from "playwright-test-coverage";
import "dotenv/config";

test("Try to use menu view 1 without logging in", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/employee/menu1`);
  await expect(page.getByRole("heading")).toContainText(
    "You are unauthorized to view this page."
  );
});

test("Try to use menu view 2 without logging in", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/employee/menu2`);
  await expect(page.getByRole("heading")).toContainText(
    "You are unauthorized to view this page."
  );
});

test("Try to use menu view 3 without logging in", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/employee/menu3`);
  await expect(page.getByRole("heading")).toContainText(
    "You are unauthorized to view this page."
  );
});
