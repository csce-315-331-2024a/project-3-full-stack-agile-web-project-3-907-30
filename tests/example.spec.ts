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
  await page.goto('http://127.0.0.1:3000');

  await expect(page.getByRole('button',{name: 'Sign-in for Rewards'})).toBeVisible;

  const rewards_button = page.getByTestId('sign-in');

  await rewards_button.click();

  await page.getByTestId('sign-in').click();
});

test('Ordering Menu is there?', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  await expect(page.getByRole('heading',{name: 'Ordering Menu'})).toBeVisible;
});

test('double stack burger button', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  await expect(page.getByTestId('Double Stack Burger')).toBeVisible;

  const double_stack_button = page.getByTestId('Double Stack Burger');

  await double_stack_button.click();
});