import { test, expect } from '@playwright/test';
import exp from 'constants';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test('sign in for rewards button', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30-g4abpv4b4.vercel.app/');

  await expect(page.getByRole('button',{name: 'Sign-in for Rewards'})).toBeVisible;
});

test('Ordering Menu is there?', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30-g4abpv4b4.vercel.app/');

  await expect(page.getByRole('heading',{name: 'Ordering Menu'})).toBeVisible;
});

test('double stack burger button', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30-g4abpv4b4.vercel.app/');

  await expect(page.getByRole('button',{name: 'Double Stack Burger'})).toBeVisible;
});
