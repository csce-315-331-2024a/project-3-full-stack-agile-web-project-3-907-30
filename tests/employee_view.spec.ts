import { test, expect } from 'playwright-test-coverage';

test('Trying to use employee pages without signing in', async ({ page }) => {
    await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
    await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/employee/order');
    await expect(page.locator('[id="__next"]')).toContainText('You are unauthorized to view this page.');
    await expect(page.getByRole('link')).toContainText('Customer Order View');
    await expect(page.getByRole('button')).toContainText('Sign-in with Google');
});

