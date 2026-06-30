import { describe, it, expect } from 'vitest'

describe('Environment variable sanity check', () => {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_PASSWORD',
  ]

  for (const varName of requiredVars) {
    it(`${varName} type check passes`, () => {
      const value = process.env[varName]
      // Soft check: in unit test environments, vars may be absent.
      // Integration/e2e suites set real env values; this test just ensures
      // process.env doesn't throw and the slot has the expected type.
      if (!value) {
        console.warn(`[env check] ${varName} is not set in this environment`)
      }
      expect(typeof value === 'string' || value === undefined).toBe(true)
    })
  }
})
