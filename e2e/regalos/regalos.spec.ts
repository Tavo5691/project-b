import { test, expect } from '@playwright/test'
import { RegalosPage } from './regalos-page'
import { CancelarPage } from '../cancelar/cancelar-page'

// Primary channel is WhatsApp — the reservation journey is verified at the
// 375px mobile viewport per the design doc's testing strategy.
test.describe('Gift registry (/regalos) — reserve flow', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test(
    'a guest can browse gifts by category and reserve an available one',
    { tag: ['@critical', '@e2e', '@reserve'] },
    async ({ page }) => {
      const regalosPage = new RegalosPage(page)
      await regalosPage.goto()

      await expect(regalosPage.categoryTabs).toBeVisible()
      await expect(regalosPage.reserveButtons.first()).toBeVisible()

      await regalosPage.reserveFirstAvailableGift({ firstName: 'Ana', lastName: 'Perez' })

      const cancelCode = await regalosPage.verifyReservationSucceeded()
      expect(cancelCode).toMatch(/^[A-Z]+-\d{4}$/)

      // Cancel what we just reserved: fixture DB has no per-test isolation
      // (no seed/teardown), so leaving the gift reserved would starve every
      // other spec that also needs an available gift to reserve.
      await regalosPage.closeModal()
      const cancelarPage = new CancelarPage(page)
      await cancelarPage.goto()
      await cancelarPage.cancelWithCode(cancelCode)
    }
  )
})
