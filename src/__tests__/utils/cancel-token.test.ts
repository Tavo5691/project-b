import { describe, it, expect, vi } from 'vitest'
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

  it('is deterministic given a mocked Math.random: lower boundary', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    // First call picks the word (index 0 of 16), second call picks the number.
    randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0)
    expect(generateCancelCode()).toBe('ROSA-1000')
    randomSpy.mockRestore()
  })

  it('is deterministic given a mocked Math.random: upper boundary', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    // Math.random() is exclusive of 1, so the closest achievable value picks
    // the last word (index 15) and the highest number (9999).
    randomSpy.mockReturnValueOnce(0.999999).mockReturnValueOnce(0.999999)
    expect(generateCancelCode()).toBe('LAGO-9999')
    randomSpy.mockRestore()
  })

  it('produces more than one distinct code across repeated calls (not hardcoded)', () => {
    const codes = new Set(Array.from({ length: 30 }, () => generateCancelCode()))
    expect(codes.size).toBeGreaterThan(1)
  })

  it('can produce every word in the allowed list given enough samples', () => {
    const seenWords = new Set<string>()
    for (let i = 0; i < 2000; i++) {
      seenWords.add(generateCancelCode().split('-')[0])
    }
    for (const word of ALLOWED_WORDS) {
      expect(seenWords).toContain(word)
    }
  })
})
