import { test, expect } from '@playwright/test';

test.describe('Survey Application Real E2E Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
    page.on('response', resp => {
      if (!resp.ok() && resp.url().includes('localhost:8080')) {
        console.log(`HTTP ${resp.status()} ${resp.url()}`);
      }
    });
  });

  test('Survey list is displayed after login', async ({ page }) => {
    // 1. Unauthenticated access redirects to login
    await page.goto('/#/admin');
    await expect(page).toHaveURL(/.*login/);

    // 2. Perform Admin Login
    await page.fill('#email', 'm@m.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // Should redirect to admin home page
    await expect(page).toHaveURL(/.*admin/);

    // The dashboard survey list should be visible (showing either "No surveys available" or the table of existing surveys)
    const noSurveysText = page.locator('text=No surveys available');
    const surveyTable = page.locator('table');
    
    // Assert that one of the two states of the list is rendered on the page
    const hasNoSurveys = await noSurveysText.isVisible();
    const hasTable = await surveyTable.isVisible();
    expect(hasNoSurveys || hasTable).toBeTruthy();
  });

  test('Full survey creation and take-survey flow', async ({ page }) => {
    // 1. Log in to create survey
    await page.goto('/#/login');
    await page.fill('#email', 'm@m.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*admin/);

    // 2. Create a Survey
    await page.click('a:has-text("Create Survey")');
    await expect(page).toHaveURL(/.*createSurvey/);

    await page.fill('input[formControlName="surveyName"]', 'E2E Customer Feedback');
    await page.fill('textarea[formControlName="description"]', 'A real E2E integration survey');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[formControlName="validTill"]', dateStr);

    // Add a question
    await page.click('button:has-text("Add New Question")');
    await page.fill('#question', 'Do you love this app?');
    await page.selectOption('#questionType', 'oneline');
    await page.click('button:has-text("Add Question to Form")');

    // Click "Create Survey"
    await page.click('button:has-text("Create Survey")');

    // Verify success message is shown on the page (allow up to 15s for backend round-trip in CI)
    await expect(page.locator('text=Successfully created survey')).toBeVisible({ timeout: 15000 });

    // Go to admin page and verify the new survey is listed
    await page.goto('/#/admin');
    await expect(page.locator('table')).toContainText('E2E Customer Feedback');

    // 3. Navigate to Take Survey — capture ID from the survey link in the table
    const surveyLinkCell = page.locator('table a[href*="takeSurvey"]').first();
    const surveyHref = await surveyLinkCell.getAttribute('href') ?? '';
    const surveyId = surveyHref.split('/').pop();
    await page.goto(`/#/takeSurvey/${surveyId}`);

    // Fill personal details
    await page.fill('#fullName', 'Jane Tester');
    await page.fill('#email', 'jane@tester.com');
    await page.click('button:has-text("Next")');

    // Fill answer to the first question
    await page.locator('input[type="text"]').first().fill('Yes, it is amazing!');
    await page.click('button:has-text("Save")');

    // Verify completion page is shown (allow up to 15s for backend round-trip in CI)
    await expect(page).toHaveURL(/.*surveycompleted/, { timeout: 15000 });
  });
});
