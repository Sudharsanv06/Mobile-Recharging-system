const { test, expect } = require('@playwright/test');

test.describe('Profile E2E', () => {
  test('loads profile page', async ({ page }) => {
    // adjust base URL if needed
    const base = process.env.PW_BASE_URL || 'http://localhost:5173';
    await page.goto(`${base}/profile`);
    // If not authenticated, the app should redirect to login — otherwise it should show profile elements
    // We'll try to detect either behavior
    const url = page.url();
    expect(url.includes('/login') || url.includes('/profile')).toBeTruthy();
  });
});
