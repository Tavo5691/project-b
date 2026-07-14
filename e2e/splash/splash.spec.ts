import { test, expect } from '@playwright/test'
import { SplashPage } from './splash-page'

// The splash page (`/`) is the new gate in front of the invitation content,
// which now lives at `/invitacion` (see `e2e/public-home/public-home.spec.ts`).
test.describe('Splash page', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test(
    'shows a heading and a link to enter',
    { tag: ['@critical', '@e2e', '@splash'] },
    async ({ page }) => {
      const splashPage = new SplashPage(page)
      await splashPage.goto()

      await expect(splashPage.heading).toBeVisible()
      await expect(splashPage.enterLink).toBeVisible()
    }
  )

  test(
    'the enter link navigates to /invitacion',
    { tag: ['@e2e', '@splash'] },
    async ({ page }) => {
      const splashPage = new SplashPage(page)
      await splashPage.goto()

      await splashPage.enterLink.click()
      await expect(page).toHaveURL(/\/invitacion$/)
    }
  )
})
