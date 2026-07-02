import { test, expect } from '@playwright/test'
import { PublicHomePage } from './public-home-page'
import { CancelarPage } from '../cancelar/cancelar-page'

// Primary channel is WhatsApp — the reservation journey is verified at the
// 375px mobile viewport per the design doc's testing strategy.
test.describe('Public gift list — reserve flow', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test(
    'a guest can browse gifts by category and reserve an available one',
    { tag: ['@critical', '@e2e', '@reserve'] },
    async ({ page }) => {
      const homePage = new PublicHomePage(page)
      await homePage.goto()

      await expect(homePage.categoryTabs).toBeVisible()
      await expect(homePage.reserveButtons.first()).toBeVisible()

      await homePage.reserveFirstAvailableGift({ firstName: 'Ana', lastName: 'Perez' })

      const cancelCode = await homePage.verifyReservationSucceeded()
      expect(cancelCode).toMatch(/^[A-Z]+-\d{4}$/)

      // Cancel what we just reserved: fixture DB has no per-test isolation
      // (no seed/teardown), so leaving the gift reserved would starve every
      // other spec that also needs an available gift to reserve.
      await homePage.closeModal()
      const cancelarPage = new CancelarPage(page)
      await cancelarPage.goto()
      await cancelarPage.cancelWithCode(cancelCode)
    }
  )
})
