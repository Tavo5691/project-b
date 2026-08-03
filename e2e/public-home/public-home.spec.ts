import { test, expect } from '@playwright/test'
import { PublicHomePage } from './public-home-page'

// Landing content now lives at `/invitacion` — `/` is a new splash gate
// (see `e2e/splash/splash.spec.ts`). This content no longer fetches
// gift/category data — that moved to `/regalos`. These specs only assert
// invitation content: event info, the CTA link, and the section nav, per
// the landing/registry split.
test.describe('Public landing page', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test(
    'shows event info and a CTA link to the gift registry',
    { tag: ['@critical', '@e2e', '@landing'] },
    async ({ page }) => {
      const homePage = new PublicHomePage(page)
      await homePage.goto()

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(homePage.regalosLink).toBeVisible()
    }
  )

  test(
    'the CTA link navigates to /regalos',
    { tag: ['@e2e', '@landing'] },
    async ({ page }) => {
      const homePage = new PublicHomePage(page)
      await homePage.goto()

      await homePage.regalosLink.click()
      await expect(page).toHaveURL(/\/regalos$/)
    }
  )

  test(
    'cancellation is still reachable from the landing page',
    { tag: ['@e2e', '@landing'] },
    async ({ page }) => {
      const homePage = new PublicHomePage(page)
      await homePage.goto()

      await expect(homePage.navCancelarLink).toBeVisible()
      await homePage.navCancelarLink.click()
      await expect(page).toHaveURL(/\/cancelar$/)
    }
  )

  test(
    'the section nav links to the gift registry',
    { tag: ['@e2e', '@landing'] },
    async ({ page }) => {
      const homePage = new PublicHomePage(page)
      await homePage.goto()

      await expect(homePage.navRegalosLink).toBeVisible()
      await homePage.navRegalosLink.click()
      await expect(page).toHaveURL(/\/regalos$/)
    }
  )
})
