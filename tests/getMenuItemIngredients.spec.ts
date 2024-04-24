import { test, expect } from 'playwright-test-coverage';
import 'dotenv/config';

test('get 404 if menu item not in database', async ({request}) => {
    const res = await request.get(`${process.env.TEST_URL}/api/menu/ingredients/300`);
    expect(res.ok()).toBe(false);
})