import { test, expect } from 'playwright-test-coverage';
import 'dotenv/config';

test('Using kitchen view without being logged in', async ({page}) => {
    await page.goto(`${process.env.TEST_URL}/employee/kitchen`);
    await expect(page.getByRole('heading')).toContainText('You are unauthorized to view this page.');




});