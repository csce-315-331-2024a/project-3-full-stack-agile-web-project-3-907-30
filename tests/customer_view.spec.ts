import { test, expect } from "playwright-test-coverage";

test("Check if menu categories are on the page", async ({ page }) => {
  await page.goto(
    "https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );

  await expect(page.getByRole("heading", { name: "Burgers & Wraps" }))
    .toBeVisible;
  await expect(page.getByRole("heading", { name: "Meals" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Tenders" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Sides" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Drinks" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Desserts" })).toBeVisible;
});

test("Check if Double Stack Burger exists", async ({ page }) => {
  await page.goto(
    "https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );
  await expect(page.getByRole("paragraph", { name: "Double Stack Burger" }))
    .toBeVisible;
});

test("Test employee login button", async ({ page }) => {
  await page.goto(
    "https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );
  await page.getByRole("link", { name: "I'm an Employee" }).click();
  await page.getByRole("button", { name: "Sign-in with Google" }).click();
});
