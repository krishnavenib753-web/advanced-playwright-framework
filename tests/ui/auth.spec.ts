import { test, expect } from '../../fixtures/base-test';
import testData from '../../data/test-data.json';

test.describe('UI - Authentication & Access Control', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-AUTH-01: Should successfully log in with valid standard credentials', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Assert inventory page is loaded
    expect(await inventoryPage.isLoaded()).toBe(true);
    await expect(inventoryPage.titleHeader).toHaveText('Products');
  });

  test('TC-AUTH-02: Should display appropriate error message for locked out user', async ({ loginPage }) => {
    await loginPage.login(testData.users.locked.username, testData.users.locked.password);
    
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(testData.users.locked.errorMessage);
  });

  test('TC-AUTH-03: Should reject login with invalid password', async ({ loginPage }) => {
    await loginPage.login(testData.users.invalid.username, testData.users.invalid.password);
    
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(testData.users.invalid.errorMessage);
  });

  test('TC-AUTH-04: Should reject login with empty username', async ({ loginPage }) => {
    await loginPage.login(testData.users.empty.username, testData.users.empty.password);
    
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(testData.users.empty.errorMessage);
  });

  test('TC-AUTH-05: Should allow authenticated user to log out cleanly', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    expect(await inventoryPage.isLoaded()).toBe(true);

    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
