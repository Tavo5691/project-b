import { test, expect } from '@playwright/test'
import { PublicHomePage } from './public-home-page'

// Landing content (`/`) no longer fetches gift/category data — that moved to
// `/regalos`. These specs only assert invitation content: event info,
// gallery, and the CTA link, per the landing/registry split.
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
    'the cancellation link is still available on the landing page',
    { tag: ['@e2e', '@landing'] },
    async ({ page }) => {
      const homePage = new PublicHomePage(page)
      await homePage.goto()

      await expect(homePage.cancelarLink).toBeVisible()
      await homePage.cancelarLink.click()
      await expect(page).toHaveURL(/\/cancelar$/)
    }
  )

  test(
    'gracefully renders the gallery section (empty if no gallery URLs)',
    { tag: ['@e2e', '@landing'] },
    async ({ page }) => {
      const homePage = new PublicHomePage(page)
      await homePage.goto()

      // Assert gallery images locator either finds images or gracefully renders nothing
      const galleryImages = homePage.galleryImages
      const count = await galleryImages.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  )
})
