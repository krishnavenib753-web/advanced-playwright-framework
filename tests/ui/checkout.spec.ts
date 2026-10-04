import { test, expect } from '../../fixtures/base-test';
import testData from '../../data/test-data.json';

test.describe('UI - End-to-End Checkout Flow', () => {
  test('TC-CHK-01: Should complete end-to-end purchase from cart to confirmation', async ({
    authenticatedUserPage,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Add product to cart
    await authenticatedUserPage.addItemToCart(testData.products.backpack);
    expect(await authenticatedUserPage.getCartCount()).toBe(1);

    // 2. Navigate to cart
    await authenticatedUserPage.goToCart();
    expect(await cartPage.isLoaded()).toBe(true);

    const cartItems = await cartPage.getItemNames();
    expect(cartItems).toContain(testData.products.backpack);

    // 3. Proceed to checkout
    await cartPage.proceedToCheckout();

    // 4. Fill shipping information
    await checkoutPage.fillInformation(
      testData.checkout.firstName,
      testData.checkout.lastName,
      testData.checkout.postalCode
    );

    // 5. Assert summary overview is displayed
    await expect(checkoutPage.summarySubtotal).toBeVisible();
    await expect(checkoutPage.finishButton).toBeVisible();

    // 6. Complete purchase
    await checkoutPage.finishOrder();

    // 7. Verify order completion message
    const isSuccess = await checkoutPage.isOrderSuccessful();
    expect(isSuccess).toBe(true);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
