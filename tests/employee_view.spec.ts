import { test, expect } from 'playwright-test-coverage';
import 'dotenv/config';

test('Trying to use employee pages without signing in', async ({ page }) => {
    await page.goto(`${process.env.TEST_URL}/`);
    await page.goto(`${process.env.TEST_URL}/employee/order`);
    await expect(page.locator('[id="__next"]')).toContainText('You are unauthorized to view this page.');
    await expect(page.getByRole('link')).toContainText('Customer Order View');
    await expect(page.getByRole('button')).toContainText('Sign-in with Google');
});

