import { test, expect } from 'playwright-test-coverage';
import 'dotenv/config';

test('improper method for API', async ({page}) => {
    const res = await page.goto(`${process.env.TEST_URL}/api/kitchen/cancel-order`);
    expect(res?.ok()).toBe(false);
})