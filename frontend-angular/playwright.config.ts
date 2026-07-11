import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // run tests sequentially to avoid database conflicts
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'cd ../backend-spring-boot && ./mvnw spring-boot:run',
      url: 'http://localhost:8080/api/surveys/getAll',
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
    }
  ],
});
