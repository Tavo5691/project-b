import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // Playwright owns e2e/**/*.spec.ts — keep Vitest from also collecting
    // them (their `test`/`test.describe` API is Playwright's, not Vitest's).
    exclude: ['node_modules/**', 'e2e/**'],
  },
})
