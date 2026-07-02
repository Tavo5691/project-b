import { Page, Locator } from '@playwright/test'
import { BasePage } from '../base-page'

export class AdminLoginPage extends BasePage {
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.passwordInput = page.getByLabel('Contraseña')
    this.submitButton = page.getByRole('button', { name: 'Ingresar' })
  }

  async goto(): Promise<void> {
    await super.goto('/admin/login')
  }

  async login(password: string): Promise<void> {
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
