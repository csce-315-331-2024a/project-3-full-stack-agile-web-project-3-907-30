import {test, expect} from 'playwright-test-coverage';

test('view customer orders while not logged in as customer', async ({page}) => {
    await page.goto(`${process.env.TEST_URL}/`);

    await expect(page.getByRole('heading', {name: 'Past Orders'})).toBeVisible;
    await page.getByRole('heading', {name: 'Past Orders'}).click();
    await expect(page.getByRole('heading', {name: 'You have no associated order history.'})).toBeVisible;
})