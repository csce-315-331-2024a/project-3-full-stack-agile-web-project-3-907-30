import { test, expect } from "playwright-test-coverage";
import "dotenv/config";

// Test 1: Get 404 if menu item not in database
test('get 404 if menu item not in database', async ({ request }) => {
  const res = await request.get(`${process.env.TEST_URL}/api/menu/ingredients/300`);
  expect(res.ok()).toBe(false);
  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ error: 'No corresponding menu item' });
});

// Test 2: Get 200 if menu item exists in database
test('get 200 if menu item exists in database', async ({ request }) => {
    const res = await request.get(`${process.env.TEST_URL}/api/menu/ingredients/1`);
    expect(res.ok()).toBe(true);
    expect(res.status()).toBe(200);
    const responseBody = await res.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  
    // Select the first item from the response array
    const napkin = responseBody.find((item:any) => item.name === 'napkin');
    expect(napkin).toBeDefined();
  
    // Verify the properties of the napkin item
    expect(napkin).toEqual(expect.objectContaining({
      id: 0,
      name: 'napkin',
      price: 0.01,
      fill_level: 10000,
      curr_level: 5000,
      times_refilled: 124,
      date_refilled: "2023-12-25T06:00:00.000Z",
      has_dairy: false,
      has_nuts: false,
      has_eggs: false,
      is_vegan: true,
      is_halal: true
    }));
  });
  