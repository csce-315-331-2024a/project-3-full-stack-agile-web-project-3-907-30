import { test, expect } from '@playwright/test';

test('check valid menu id', async ({request}) => {
    const res = await request.get('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/api/menu/ingredients/1');
    expect(res.ok()).toBe(true);
    const json = await res.json();
    expect(json).toStrictEqual([{"id":0,"name":"napkin","price":0.01,"fill_level":10000,"curr_level":5000,"times_refilled":124,"date_refilled":"2023-12-25T00:00:00.000Z","has_dairy":false,"has_nuts":false,"has_eggs":false,"is_vegan":true,"is_halal":true},{"id":12,"name":"burger patty","price":0.3,"fill_level":8000,"curr_level":10000,"times_refilled":151,"date_refilled":"2023-12-15T00:00:00.000Z","has_dairy":false,"has_nuts":false,"has_eggs":false,"is_vegan":false,"is_halal":true},{"id":13,"name":"bun","price":0.1,"fill_level":1000,"curr_level":2000,"times_refilled":198,"date_refilled":"2023-12-25T00:00:00.000Z","has_dairy":false,"has_nuts":false,"has_eggs":false,"is_vegan":true,"is_halal":true},{"id":15,"name":"lettuce","price":0.03,"fill_level":20000,"curr_level":30000,"times_refilled":25,"date_refilled":"2023-12-15T00:00:00.000Z","has_dairy":false,"has_nuts":false,"has_eggs":false,"is_vegan":true,"is_halal":true},{"id":16,"name":"tomato","price":0.03,"fill_level":20000,"curr_level":30000,"times_refilled":90,"date_refilled":"2023-12-15T00:00:00.000Z","has_dairy":false,"has_nuts":false,"has_eggs":false,"is_vegan":true,"is_halal":true},{"id":17,"name":"onion","price":0.03,"fill_level":20000,"curr_level":12000,"times_refilled":61,"date_refilled":"2023-12-15T00:00:00.000Z","has_dairy":false,"has_nuts":false,"has_eggs":false,"is_vegan":true,"is_halal":true},{"id":30,"name":"pickle","price":0.05,"fill_level":7000,"curr_level":8000,"times_refilled":123,"date_refilled":"2023-12-15T00:00:00.000Z","has_dairy":false,"has_nuts":false,"has_eggs":false,"is_vegan":true,"is_halal":true}])
})

test('get 404 if menu item not in database', async ({request}) => {
    const res = await request.get('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/api/menu/ingredients/300');
    expect(res.ok()).toBe(false);
})