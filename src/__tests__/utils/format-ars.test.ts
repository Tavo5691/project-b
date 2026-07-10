import { describe, it, expect } from 'vitest'
import { formatARS } from '@/lib/utils'

describe('formatARS()', () => {
  it('formats a mid-size price with es-AR thousands separator and $ prefix', () => {
    expect(formatARS(15000)).toBe('$15.000')
  })

  it('formats a large price with multiple thousands separators', () => {
    expect(formatARS(1250000)).toBe('$1.250.000')
  })

  it('formats a small price under 1000 with no separator', () => {
    expect(formatARS(500)).toBe('$500')
  })

  it('formats zero as "$0" (callers decide whether to hide it, not the formatter)', () => {
    expect(formatARS(0)).toBe('$0')
  })

  it('never renders decimals, even if given a fractional input', () => {
    expect(formatARS(1500.75)).not.toContain(',')
  })
})
