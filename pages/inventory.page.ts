import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly titleHeader: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutSidebarLink: Locator;

  constructor(page: Page) {
    super(page);
    this.titleHeader = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutSidebarLink = page.locator('#logout_sidebar_link');
  }

  async isLoaded(): Promise<boolean> {
    await this.titleHeader.waitFor({ state: 'visible' });
    return (await this.titleHeader.textContent()) === 'Products';
  }

  async addItemToCart(productName: string): Promise<void> {
    const itemContainer = this.inventoryItems.filter({ hasText: productName });
    await itemContainer.locator('button:has-text("Add to cart")').click();
  }

  async removeItemFromCart(productName: string): Promise<void> {
    const itemContainer = this.inventoryItems.filter({ hasText: productName });
    await itemContainer.locator('button:has-text("Remove")').click();
  }

  async getCartCount(): Promise<number> {
    if (await this.shoppingCartBadge.isVisible()) {
      const text = await this.shoppingCartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getAllItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getAllItemPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }

  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutSidebarLink.waitFor({ state: 'visible' });
    await this.logoutSidebarLink.click();
  }
}
