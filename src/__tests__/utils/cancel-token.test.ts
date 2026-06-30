import { describe, it, expect } from 'vitest'
import { generateCancelCode } from '@/lib/utils'

const ALLOWED_WORDS = [
  'ROSA', 'LUNA', 'SOL', 'MAR', 'BEBE', 'AMOR',
  'NUBE', 'BESO', 'MIEL', 'CUNA', 'ALBA', 'FLOR',
  'RAYO', 'AGUA', 'VELA', 'LAGO',
]

describe('generateCancelCode()', () => {
  it('output matches WORD-NNNN pattern', () => {
    const code = generateCancelCode()
    expect(code).toMatch(/^[A-Z]+-\d{4}$/)
  })

  it('word part is from the allowed list', () => {
    // Sample 50 codes to reduce flakiness
    for (let i = 0; i < 50; i++) {
      const code = generateCancelCode()
      const [word] = code.split('-')
      expect(ALLOWED_WORDS).toContain(word)
    }
  })

  it('number part is in the range [1000, 9999]', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCancelCode()
      const parts = code.split('-')
      const num = parseInt(parts[parts.length - 1], 10)
      expect(num).toBeGreaterThanOrEqual(1000)
      expect(num).toBeLessThanOrEqual(9999)
    }
  })

  it('returns a non-empty string', () => {
    expect(generateCancelCode()).toBeTruthy()
  })
})
