import { Page, Locator } from '@playwright/test'
import { BasePage } from '../base-page'

export class PublicHomePage extends BasePage {
  readonly galleryImages: Locator
  readonly regalosLink: Locator
  readonly cancelarLink: Locator

  constructor(page: Page) {
    super(page)
    this.galleryImages = page.getByRole('img').and(page.locator('[alt^="Foto "]'))
    this.regalosLink = page.getByRole('link', { name: 'Lista de regalos' })
    this.cancelarLink = page.getByRole('link', {
      name: '¿Ya reservaste y necesitás cancelar?',
    })
  }

  async goto(): Promise<void> {
    await super.goto('/invitacion')
  }
}
