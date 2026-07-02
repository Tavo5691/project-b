import { defineConfig, devices } from '@playwright/test'
import { loadEnvConfig } from '@next/env'

// Load .env.local (ADMIN_PASSWORD, Supabase keys) into process.env for the
// Playwright test runner process — Next.js loads it automatically for the
// app itself, but the test runner is a separate Node process.
loadEnvConfig(process.cwd())

export default defineConfig({
  testDir: './e2e',
  // Specs share one live Supabase project with no per-test seeding/teardown
  // (single fixture gift). Running workers in parallel makes independent
  // specs race to reserve the same gift via the atomic reserve_gift RPC —
  // only one wins, the other sees a false failure. Serial execution avoids
  // that until real test fixtures/seeding exist.
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
})
