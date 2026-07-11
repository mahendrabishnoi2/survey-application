import { test, expect } from '@playwright/test';

test.describe('Survey Application E2E Tests', () => {
  test('Unauthenticated access to /admin redirects to /login', async ({ page }) => {
    await page.goto('/#/admin');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Admin login flow', async ({ page }) => {
    // Mock the backend API responses for login and admin surveys
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, email: 'admin@test.com', password: 'password', fullName: 'Test Admin' }),
      });
    });

    await page.route('**/api/surveys', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Customer Satisfaction', description: 'Help us improve', created: new Date(), validTill: new Date() }
        ]),
      });
    });

    await page.goto('/#/login');
    await page.fill('#email', 'admin@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*admin/);
  });

  test('Take survey flow', async ({ page }) => {
    // Mock the backend API for survey details, user verification, and submissions
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await page.route('**/api/surveys/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Customer Satisfaction',
          description: 'Help us improve',
          validTill: tomorrow.toISOString(),
          questions: [
            { id: 1, question: 'How is the app?', type: { typeName: 'oneline' }, validation: '', options: [] }
          ]
        }),
      });
    });

    await page.route('**/api/verifyUser/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(false), // has not taken survey yet
      });
    });

    await page.route('**/api/respondant/new/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(false),
      });
    });

    await page.route('**/api/surveys/response', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Go to take survey page
    await page.goto('/#/takeSurvey/1');

    // Fill personal details
    await page.fill('#fullName', 'John Doe');
    await page.fill('#email', 'john@example.com');
    await page.click('button:has-text("Next")');

    // Fill the survey response
    await page.fill('input.form-control', 'It is great!');
    await page.click('button:has-text("Save")');

    await expect(page).toHaveURL(/.*surveycompleted/);
  });
});
