import { test, expect } from "playwright-test-coverage";
import "dotenv/config";

test("Check if menu categories are on the page", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);

  await expect(page.getByRole("heading", { name: "Burgers & Wraps" }))
    .toBeVisible;
  await expect(page.getByRole("heading", { name: "Meals" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Tenders" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Sides" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Drinks" })).toBeVisible;
  await expect(page.getByRole("heading", { name: "Desserts" })).toBeVisible;
});

test("Check if Double Stack Burger exists", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await expect(page.getByRole("paragraph", { name: "Double Stack Burger" }))
    .toBeVisible;
});

test("Test employee login button", async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByRole("link", { name: "I'm an Employee" }).click();
  await page.getByRole("button", { name: "Sign-in with Google" }).click();
});

test('Translate to Dutch', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByRole('combobox').click();
  await page.getByText('Dutch').click();
});

test('Check welcome message', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await expect(page.locator('h1')).toContainText('Welcome! Sign-in to view your points.');
});

test('Check customer rewards sign-in', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await expect(page.getByRole('heading')).toContainText('View your points');
});

test('Test Rev AI button and popup', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByTestId('ai-button').click();
  await expect(page.getByRole('heading')).toContainText('How are you feeling today?');
  await expect(page.locator('[id="\\:r2f\\:-form-item-description"]')).toContainText('Please enter how you\'re feeling (e.g. happy, sad, hungry, etc.).');
});

test('Sign in as customer', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}/`);
  await page.getByLabel('Phone Number').fill('');
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await page.getByLabel('Phone Number').fill('8324099894');
  await page.getByRole('button', { name: 'Sign-in' }).click();
  await page.getByText('Success!').click();
});

test('Sign in as customer that does not exist', async ({ page }) => {
  await page.goto(`${process.env.TEST_URL}`);
  await page.getByLabel('Phone Number').fill('');
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await page.getByLabel('Phone Number').fill('4444444444');
  await page.getByRole('button', { name: 'Sign-in' }).click();
  await expect(page.locator('li')).toContainText('Customer not found.');
  await page.getByText('Error!').click();
});

test('Trying to make a new account with already taken number', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByLabel('Phone Number').fill('');
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await page.getByRole('button', { name: 'No Account? Sign-up Here' }).click();
  await page.getByPlaceholder('john').fill('j');
  await page.getByPlaceholder('john').press('Tab');
  await page.getByPlaceholder('smith').fill('smith');
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('');
  await page.getByPlaceholder('smith').press('Tab');
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('5403537927');
  await page.getByRole('button', { name: 'Make Account' }).click();
  await expect(page.locator('li')).toContainText('This phone number is already associated with an account');
});

test('Making new customer account', async ({ page }) => {
  await page.getByLabel('Phone Number').fill('');
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await page.getByRole('button', { name: 'No Account? Sign-up Here' }).click();
  await page.getByPlaceholder('john').fill('isaac');
  await page.getByPlaceholder('john').press('Tab');
  await page.getByPlaceholder('smith').fill('lemus');
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('');
  await page.getByPlaceholder('smith').press('Tab');
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('3619459580');
  await page.getByRole('textbox', { name: 'Phone Number' }).press('Enter');
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('');
  await expect(page.locator('li')).toContainText('Welcome to the family, isaac lemus');
});