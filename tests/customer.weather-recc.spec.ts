import {test, expect} from 'playwright-test-coverage';

test('check that the associated tab is visible', async ({page}) => {
    await page.goto(`${process.env.TEST_URL}/`);
    await expect(page.getByRole('heading', {name: 'Climate Cravings'})).toBeVisible;
})

test('check that there are no recommendations', async ({page}) => {
    await page.goto(`${process.env.TEST_URL}/`);
    await page.getByRole('heading', {name: 'Climate Cravings'}).click();
    await expect(page.getByRole('heading', {name: 'No items to display right now. Check out our menu!'})).toBeVisible;
})