import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './admin-page'

test.describe('Admin authentication', () => {
  test(
    'redirects unauthenticated visitors from /admin to /admin/login',
    { tag: ['@critical', '@e2e', '@admin-auth'] },
    async ({ page }) => {
      await page.goto('/admin')
      await expect(page).toHaveURL(/\/admin\/login$/)
    }
  )

  test(
    'shows an error and stays on the login page with the wrong password',
    { tag: ['@e2e', '@admin-auth'] },
    async ({ page }) => {
      const loginPage = new AdminLoginPage(page)
      await loginPage.goto()
      await loginPage.login('definitely-wrong-password')

      // Scoped by text, not role=alert: Next.js's own route announcer
      // (#__next-route-announcer__) also carries role="alert", so
      // getByRole('alert') alone matches two elements.
      await expect(page.getByText('Contraseña incorrecta')).toBeVisible()
      await expect(page).toHaveURL(/\/admin\/login$/)
    }
  )

  test(
    'logs in with the correct password and reaches the dashboard',
    { tag: ['@critical', '@e2e', '@admin-auth'] },
    async ({ page }) => {
      const adminPassword = process.env.ADMIN_PASSWORD
      test.skip(!adminPassword, 'ADMIN_PASSWORD not set in the test environment')

      const loginPage = new AdminLoginPage(page)
      await loginPage.goto()
      await loginPage.login(adminPassword ?? '')

      await expect(page).toHaveURL(/\/admin$/)
      await expect(
        page.getByRole('heading', { name: 'Panel de administración' })
      ).toBeVisible()
    }
  )
})
