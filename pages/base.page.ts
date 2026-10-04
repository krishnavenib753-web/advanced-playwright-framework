import { Page, Locator } from '@playwright/test';

/**
 * BasePage encapsulates common behavior, navigation, and helpers
 * across all Page Objects in the framework.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a relative or absolute URL
   */
  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Returns current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Returns document title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Waits for DOM to reach network idle state
   */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
