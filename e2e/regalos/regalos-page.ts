import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'

export interface ReservationData {
  firstName: string
  lastName: string
}

export class RegalosPage extends BasePage {
  readonly categoryTabs: Locator
  readonly reserveButtons: Locator

  constructor(page: Page) {
    super(page)
    this.categoryTabs = page.getByRole('tablist')
    this.reserveButtons = page.getByRole('button', { name: 'Reservar' })
  }

  async goto(): Promise<void> {
    await super.goto('/regalos')
  }

  async reserveFirstAvailableGift(data: ReservationData): Promise<void> {
    await this.reserveButtons.first().click()
    await this.page.getByLabel('Nombre').fill(data.firstName)
    await this.page.getByLabel('Apellido').fill(data.lastName)
    await this.page.getByRole('button', { name: 'Confirmar reserva' }).click()
  }

  /** Verifies the modal reached the "thanks" state and returns the cancel code shown. */
  async verifyReservationSucceeded(): Promise<string> {
    await expect(this.page.getByText('¡Gracias por tu reserva!')).toBeVisible()
    const code = await this.page.getByText(/^[A-Z]+-\d{4}$/).textContent()
    return code?.trim() ?? ''
  }

  async closeModal(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cerrar' }).click()
  }
}
