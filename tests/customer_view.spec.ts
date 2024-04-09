import { test, expect } from "@playwright/test";
import exp from "constants";

test("Check if menu categories are on the page", async ({ page }) => {
  await page.goto(
    "https://https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
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
    "https://https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );
  await expect(page.getByRole("paragraph", { name: "Double Stack Burger" }))
    .toBeVisible;
});

test("Testing random menu item clicks", async ({ page }) => {
  await page.goto(
    "https://https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );
  await page
    .locator("div")
    .filter({ hasText: /^Bacon Cheeseburger\$8\.29$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Classic Hamburger\$6\.89$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Double Stack Burger\$9\.99$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Gig Em Patty Melt\$7\.59$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Tuna Melt\$7\.99$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("tab", { name: "Tenders" }).click();
  await page.getByRole("tab", { name: "Drinks" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Aggie Shake \(Chocolate\)\$4\.49$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
});

test("Test if burgers and wraps pop up correctly", async ({ page }) => {
  await page.goto(
    "https://https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );
  await page
    .locator("div")
    .filter({ hasText: /^Bacon Cheeseburger\$8\.29$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Classic Hamburger\$6\.89$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Double Stack Burger\$9\.99$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Gig Em Patty Melt\$7\.59$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Cheeseburger\$6\.89$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Black Bean Burger\$8\.38$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Revs Grilled Chicken Sandwich\$8\.39$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Spicy Chicken Sandwich\$8\.39$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Aggie Chicken Club\$8\.39$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Chicken Wraps\$6\.00$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Fish Sandwich\$7\.99$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Tuna Melt\$7\.99$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Close" }).click();
});

test("Test employee login button", async ({ page }) => {
  await page.goto(
    "https://https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );
  await page.getByRole("link", { name: "I'm an Employee" }).click();
  await page.getByRole("button", { name: "Sign-in with Google" }).click();
});

test("Signing in with phone number that is not in customer database", async ({
  page,
}) => {
  await page.goto(
    "https://https://project-3-full-stack-agile-web-project-3-907-30.vercel.app"
  );
  await page.getByRole("button", { name: "Sign-in for Rewards" }).click();
  await page.getByLabel("Phone Number").fill("1111111111");
  await page.getByLabel("Phone Number").press("Enter");
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("heading", { name: "No customer found." }).click();
});
