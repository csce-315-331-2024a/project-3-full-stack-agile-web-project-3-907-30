import { test, expect } from '@playwright/test';
import exp from 'constants';

test('Ordering Menu is there?', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');

  await expect(page.getByRole('heading',{name: 'Ordering Menu'})).toBeVisible;
});

test('double stack burger button', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await page.getByRole('button', { name: 'Double Stack Burger' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Signing in customer Michael Thompson', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await page.getByLabel('Phone Number').fill('');
  await page.getByLabel('Phone Number').click();
  await page.getByLabel('Phone Number').fill('1122248622');
  await page.getByRole('button', { name: 'Sign-in' }).click();
  await expect(page.getByRole('main')).toContainText('Hey Michael Thompson! You have 66179 points!');
  await page.getByRole('button', { name: 'Double Stack Burger' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Testing random clicks', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await page.getByRole('button', { name: 'Hot Dog Value Meal' }).click();
  await expect(page.getByRole('img', { name: 'Hot Dog Value Meal' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await page.getByLabel('Phone Number').fill('');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Testing if Burgers pop-up correctly', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await page.getByRole('button', { name: 'Bacon Cheeseburger' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Classic Hamburger' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Double Stack Burger' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Gig Em Patty Melt' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Cheeseburger', exact: true }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Black Bean Burger' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Revs Grilled Chicken Sandwich' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Spicy Chicken Sandwich' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Aggie Chicken Club' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Chicken Wraps' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Fish Sandwich' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Tuna Melt' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('Aggie Chicken Club')).toBeVisible();
});

test('Test employee login button', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await page.getByRole('link', { name: 'I\'m an Employee' }).click();
  await page.getByRole('button', { name: 'Sign-in with Google' }).click();
});

test('Checking visible names', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/employee/order');
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await expect(page.getByRole('main')).toContainText('Sign in here >');
  await expect(page.getByRole('main')).toContainText('Rev\'s American Grill');
  await expect(page.getByRole('link')).toContainText('I\'m an Employee');
  await expect(page.getByRole('main')).toContainText('Sign-in for Rewards');
  await expect(page.getByRole('main')).toContainText('Ordering Menu');
  await expect(page.getByRole('main')).toContainText('Burgers & Wraps');
  await expect(page.getByRole('main')).toContainText('Meals');
  await expect(page.getByRole('main')).toContainText('2 Corn Dog Value Meal');
  await expect(page.getByRole('main')).toContainText('2 Hot Dog Value Meal');
  await expect(page.getByRole('main')).toContainText('Bacon Cheeseburger');
  await expect(page.getByRole('main')).toContainText('Classic Hamburger');
  await expect(page.getByRole('main')).toContainText('Double Stack Burger');
  await expect(page.getByRole('main')).toContainText('Gig Em Patty Melt');
  await expect(page.getByRole('main')).toContainText('Cheeseburger');
  await expect(page.getByRole('main')).toContainText('Black Bean Burger');
  await expect(page.getByRole('main')).toContainText('Revs Grilled Chicken Sandwich');
  await expect(page.getByRole('main')).toContainText('Spicy Chicken Sandwich');
  await expect(page.getByRole('main')).toContainText('Aggie Chicken Club');
  await expect(page.getByRole('main')).toContainText('Chicken Wraps');
  await expect(page.getByRole('main')).toContainText('Fish Sandwich');
  await expect(page.getByRole('main')).toContainText('Tuna Melt');
});

test('Signing in with phone number that is not in customer database', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await page.getByRole('button', { name: 'Sign-in for Rewards' }).click();
  await page.getByLabel('Phone Number').fill('1111111111');
  await page.getByLabel('Phone Number').press('Enter');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('heading', { name: 'Sign in failed :(' }).click();
});

test('Check ', async ({ page }) => {
  await page.goto('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/');
  await page.getByRole('button', { name: 'Aggie Shake (Oreo)' }).click();
  await expect(page.locator('label')).toContainText('Ingredients:');
  await page.getByRole('button', { name: 'Close' }).click();
});