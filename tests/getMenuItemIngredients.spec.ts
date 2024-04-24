import { test, expect } from 'playwright-test-coverage';

test('get 404 if menu item not in database', async ({request}) => {
    const res = await request.get('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/api/menu/ingredients/300');
    expect(res.ok()).toBe(false);
})