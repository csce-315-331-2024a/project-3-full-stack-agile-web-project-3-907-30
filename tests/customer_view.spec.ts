import { test, expect } from "playwright-test-coverage";
import "dotenv/config";

test("Check if menu categories are on the page", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);

  await expect(page.getByRole("heading", { name: "Burgers & Wraps" }))
    .toBeVisible;
  await expect(page.getByRole("heading", { name: "Meals" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Tenders" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Sides" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Drinks" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Desserts" })).toBeVisible;
});

test("Check if Double Stack Burger exists", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await expect(page.getByRole("paragraph", { name: "Double Stack Burger" }))
    .toBeVisible;
});

test("Test employee login button", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByRole("link", { name: "I'm an Employee" }).click();
  await page.getByRole("button", { name: "Sign-in with Google" }).click();
});

test('Translate to Dutch', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByRole('combobox').click();
  await page.getByText('Dutch').click();
});

test('Check welcome message', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await expect(page.getByRole('main')).toContainText('Welcome! Sign-in to view your points.');
});

test('Check customer rewards sign-in', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await expect(page.getByRole('heading')).toContainText('View your points');
});

test('Check AI image message', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await expect(page.getByLabel('Burgers & Wraps').getByRole('heading')).toContainText('Images generated with DALL-E. Prompts available on request.');
});
