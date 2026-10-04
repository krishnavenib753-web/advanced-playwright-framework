import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ApiClient } from '../utils/api-client';
import { A11yHelper } from '../utils/a11y-helper';

/**
 * Custom Fixtures Type Definition
 * Injects pre-instantiated page objects and utilities directly into test functions.
 */
type CustomFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  apiClient: ApiClient;
  a11yHelper: typeof A11yHelper;
  authenticatedUserPage: InventoryPage;
};

export const test = baseTest.extend<CustomFixtures>({
  // Page Object Fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  // API Client Fixture
  apiClient: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    await use(apiClient);
  },

  // Accessibility Scanner Fixture
  a11yHelper: async ({}, use) => {
    await use(A11yHelper);
  },

  // Composed Fixture: Pre-authenticates the user and navigates directly to the inventory page
  authenticatedUserPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.isLoaded();
    await use(inventoryPage);
  },
});

export { expect };
