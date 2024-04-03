import { test, expect } from '@playwright/test';

test('Clicking on static menu, checkimg if categories are there', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/employee/menu');
  await page.getByText('Revs Grilled Chicken Sandwich').click();
  await page.getByText('Bacon Cheeseburger$').click();
  await page.getByText('Classic Hamburger').click();
  await page.getByText('Double Stack Burger').click();
  await page.getByRole('heading', { name: 'Sides' }).click();
  await page.getByText('Aggie Shake (Chocolate)').click();
  await expect(page.locator('[id="__next"]')).toContainText('Meals');
  await expect(page.locator('[id="__next"]')).toContainText('Tenders');
  await expect(page.locator('[id="__next"]')).toContainText('Drinks');
  await expect(page.locator('[id="__next"]')).toContainText('Double Scoop Ice Cream');
});