import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BabyChuchiLab } from '@/components/public/baby-chuchi-lab'

// The component anchors gestation at `Date.UTC(2026, 1, 9)` — the last
// menstrual period. Pinning the system clock makes every assertion below a
// fixed, timezone-independent expectation.
const LMP = Date.UTC(2026, 1, 9)
const DAY = 86400000
const WEEK = 7 * DAY

function renderAt(time: number) {
  vi.useFakeTimers()
  vi.setSystemTime(time)
  // Client-only render, so `useSyncExternalStore` reads the live snapshot
  // immediately — the `null` server snapshot only applies during SSR.
  return render(<BabyChuchiLab />)
}

afterEach(() => {
  vi.useRealTimers()
})

describe('BabyChuchiLab', () => {
  it('derives the gestation week from the last-period date', () => {
    renderAt(LMP + 25 * WEEK)

    expect(screen.getByText('25 semanas')).toBeInTheDocument()
  })

  it('clamps the progress bar at 100% once past full term', () => {
    const { container } = renderAt(LMP + 44 * WEEK)

    const fill = container.querySelector('[data-testid="progress-fill"]')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('reveals only the facts whose week threshold has been reached', () => {
    // Week 18 crosses the 8/12/16/18 facts but not the 21-week one.
    renderAt(LMP + 18 * WEEK)

    expect(screen.getByText('Ya tiene latido de corazón')).toBeInTheDocument()
    expect(screen.getByText('Ya escucha cuando le cantamos')).toBeInTheDocument()
    expect(screen.queryByText('Reconoce sabores')).not.toBeInTheDocument()
  })

  it('stops its hourly refresh on unmount', () => {
    const { unmount } = renderAt(LMP + 25 * WEEK)
    expect(vi.getTimerCount()).toBeGreaterThan(0)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
