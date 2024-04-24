import { test, expect } from "playwright-test-coverage";
import "dotenv/config";

test("get list of ingredients under required stock level", async ({
  request,
}) => {
  const res = await request.get(
    `${process.env.TEST_URL}/api/menu/check-stock/24`
  );
  expect(res.ok()).toBe(true);
  const json = await res.json();
  expect(json).toStrictEqual([
    {
      id: 0,
      name: "napkin",
      price: 0.01,
      fill_level: 10000,
      curr_level: 5000,
      times_refilled: 124,
      date_refilled: "2023-12-25T06:00:00.000Z",
      has_dairy: false,
      has_nuts: false,
      has_eggs: false,
      is_vegan: true,
      is_halal: true,
    },
  ]);
});

test("get 404 response if menu id not in database", async ({ request }) => {
  const res = await request.get(
    `${process.env.TEST_URL}/api/menu/check-stock/300`
  );
  expect(res.ok()).toBe(false);
});
