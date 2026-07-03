import { Page } from '@playwright/test'

/** Parent class for all Page Objects. */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path)
  }
}
