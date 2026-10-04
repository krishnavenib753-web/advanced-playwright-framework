import { test, expect } from '../../fixtures/base-test';

test.describe('Visual Regression - Pixel-Level UI Consistency', () => {
  test('TC-VIS-01: Login page layout should match baseline snapshot', async ({ page, loginPage }) => {
    await loginPage.goto();

    // Verify entire login viewport matches visual baseline
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('TC-VIS-02: Login credentials box component should match baseline snapshot', async ({ loginPage }) => {
    await loginPage.goto();

    // Element-level screenshot testing
    await expect(loginPage.credentialsSection).toHaveScreenshot('credentials-box.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('TC-VIS-03: Inventory header navigation bar should match visual baseline', async ({
    authenticatedUserPage,
  }) => {
    const headerContainer = authenticatedUserPage.page.locator('.primary_header');
    await expect(headerContainer).toHaveScreenshot('inventory-header.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
