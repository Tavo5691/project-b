import { test, expect } from '@playwright/test'
import { PublicHomePage } from '../public-home/public-home-page'
import { CancelarPage } from './cancelar-page'

test.describe('Cancellation flow', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test(
    'a guest can cancel a reservation using the cancel code',
    { tag: ['@critical', '@e2e', '@cancel'] },
    async ({ page }) => {
      // Reserve first so we have a valid code to cancel — reuses the
      // public-home Page Object rather than duplicating the reserve flow.
      const homePage = new PublicHomePage(page)
      await homePage.goto()
      await homePage.reserveFirstAvailableGift({ firstName: 'Bruno', lastName: 'Diaz' })
      const cancelCode = await homePage.verifyReservationSucceeded()
      await homePage.closeModal()

      const cancelarPage = new CancelarPage(page)
      await cancelarPage.goto()
      await cancelarPage.cancelWithCode(cancelCode)

      await expect(page.getByRole('status')).toBeVisible()
    }
  )

  test(
    'shows an error message for a code that matches no reservation',
    { tag: ['@e2e', '@cancel'] },
    async ({ page }) => {
      const cancelarPage = new CancelarPage(page)
      await cancelarPage.goto()
      await cancelarPage.cancelWithCode('FAKE-0000')

      await expect(
        page.getByText('No encontramos una reserva con ese código.')
      ).toBeVisible()
    }
  )
})
