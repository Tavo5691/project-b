import { Page, Locator } from '@playwright/test'
import { BasePage } from '../base-page'

export class SplashPage extends BasePage {
  readonly heading: Locator
  readonly enterLink: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { level: 1 })
    this.enterLink = page.getByRole('link', { name: 'Haz click para ingresar' })
  }

  async goto(): Promise<void> {
    await super.goto('/')
  }
}
