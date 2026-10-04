import { test, expect } from '../../fixtures/base-test';
import testData from '../../data/test-data.json';

test.describe('UI - Product Catalog & Cart Operations', () => {
  test('TC-INV-01: Should display all products in the catalog', async ({ authenticatedUserPage }) => {
    const items = await authenticatedUserPage.getAllItemNames();
    expect(items.length).toBeGreaterThanOrEqual(6);
    expect(items).toContain(testData.products.backpack);
  });

  test('TC-INV-02: Should add and remove products dynamically updating cart badge', async ({ authenticatedUserPage }) => {
    // Initially cart count is 0
    expect(await authenticatedUserPage.getCartCount()).toBe(0);

    // Add first item
    await authenticatedUserPage.addItemToCart(testData.products.backpack);
    expect(await authenticatedUserPage.getCartCount()).toBe(1);

    // Add second item
    await authenticatedUserPage.addItemToCart(testData.products.bikeLight);
    expect(await authenticatedUserPage.getCartCount()).toBe(2);

    // Remove first item
    await authenticatedUserPage.removeItemFromCart(testData.products.backpack);
    expect(await authenticatedUserPage.getCartCount()).toBe(1);
  });

  test('TC-INV-03: Should sort products by price ascending (low to high)', async ({ authenticatedUserPage }) => {
    await authenticatedUserPage.sortBy('lohi');
    const prices = await authenticatedUserPage.getAllItemPrices();

    // Verify array is sorted in ascending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('TC-INV-04: Should sort products by price descending (high to low)', async ({ authenticatedUserPage }) => {
    await authenticatedUserPage.sortBy('hilo');
    const prices = await authenticatedUserPage.getAllItemPrices();

    // Verify array is sorted in descending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });
});
