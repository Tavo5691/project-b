import { Page, Locator } from '@playwright/test'
import { BasePage } from '../base-page'

export class PublicHomePage extends BasePage {
  readonly navRegalosLink: Locator
  readonly navCancelarLink: Locator
  readonly regalosLink: Locator

  constructor(page: Page) {
    super(page)
    const nav = page.getByRole('navigation', { name: 'Secciones' })
    this.navRegalosLink = nav.getByRole('link', { name: 'Regalos' })
    // The invitation's footer link to /cancelar was removed with the design
    // port — the section nav is now the only route to cancellation.
    this.navCancelarLink = nav.getByRole('link', { name: 'Cancelar' })
    this.regalosLink = page.getByRole('link', { name: 'Lista de regalos' })
  }

  async goto(): Promise<void> {
    await super.goto('/invitacion')
  }
}
