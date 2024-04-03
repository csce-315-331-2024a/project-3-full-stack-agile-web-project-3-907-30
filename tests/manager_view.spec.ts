import { test, expect } from '@playwright/test';

test('Using manager view without being logged in', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/employee/manager');
  await expect(page.getByRole('heading')).toContainText('You are unauthorized to view this page.');
  await expect(page.getByRole('link')).toContainText('Customer Order View');
  await expect(page.getByRole('button')).toContainText('Sign-in with Google');
  await page.getByRole('link', { name: 'Customer Order View' }).click();
});