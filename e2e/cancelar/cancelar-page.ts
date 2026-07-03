import { Page, Locator } from '@playwright/test'
import { BasePage } from '../base-page'

export class CancelarPage extends BasePage {
  readonly codeInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.codeInput = page.getByLabel('Código de cancelación')
    this.submitButton = page.getByRole('button', { name: 'Confirmar cancelación' })
  }

  async goto(): Promise<void> {
    await super.goto('/cancelar')
  }

  async cancelWithCode(code: string): Promise<void> {
    await this.codeInput.fill(code)
    await this.submitButton.click()
  }
}
