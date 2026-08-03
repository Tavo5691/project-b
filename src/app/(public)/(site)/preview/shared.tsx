import { cn } from '@/lib/utils'

/**
 * TEMPORARY — shared layout for the full-bleed preview sections.
 *
 * Desktop (`md` and up): the section fills the viewport below the nav with a
 * thin gutter and splits 50/50. Mobile keeps each section's current
 * production stacking exactly — same max width, same gap, same padding — so
 * phones see no change at all.
 *
 * `svh` rather than `vh` so mobile browser chrome can't push a section past
 * the fold; `--nav-h` matches the sticky navbar's measured height (49px).
 */

export const NAV_H = '3.0625rem'

/** Viewport height minus the nav and the section's own top/bottom gutter. */
export const SPLIT_HEIGHT = 'md:h-[calc(100svh-var(--nav-h)-1.5rem)]'

/**
 * Makes an otherwise unchanged production section cover one screen the way
 * the intro does: same thin gutter, content spanning the full width rather
 * than sitting in a centred column.
 *
 * Applies to the outer `<section>`. Mobile keeps the production padding —
 * `md:p-3` overrides `px-6 py-16 sm:px-12` only from `md` up.
 */
export const FULL_SCREEN =
  'md:flex md:h-[calc(100svh-var(--nav-h))] md:min-h-[34rem] md:px-10 md:py-3 lg:px-16'

/**
 * Applies to the content column inside a `FULL_SCREEN` section: full width
 * and full height on desktop, unchanged (max-w, centred) on mobile.
 */
export const FULL_SCREEN_COLUMN = 'md:h-full md:max-w-none'

/**
 * Marks the block that should absorb the section's leftover vertical space —
 * the direct analogue of the intro's two panels filling their halves. Without
 * it the content hugs the top and the section reads as mostly empty.
 */
export const FULL_SCREEN_FILL = 'md:min-h-0 md:flex-1'

interface SplitSectionProps {
  /** Background utility for the whole band, e.g. `bg-cream`. */
  bg: string
  /** Max width of the stacked mobile column — matches the production section. */
  mobileMaxWidth: string
  /** Gap between stacked blocks on mobile — matches the production section. */
  mobileGap: string
  left: React.ReactNode
  right: React.ReactNode
}

export function SplitSection({
  bg,
  mobileMaxWidth,
  mobileGap,
  left,
  right,
}: SplitSectionProps) {
  return (
    <section
      className={cn('w-full px-6 py-16 md:min-h-[34rem] md:p-3', bg)}
      style={{ ['--nav-h' as string]: NAV_H }}
    >
      <div
        className={cn(
          'mx-auto grid w-full grid-cols-1',
          mobileMaxWidth,
          mobileGap,
          SPLIT_HEIGHT,
          'md:max-w-none md:grid-cols-2 md:gap-3'
        )}
      >
        {left}
        {right}
      </div>
    </section>
  )
}

/** Left-hand column: headline plus supporting copy, centered on desktop. */
export function SplitCopy({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:h-full md:justify-center md:px-6 lg:px-12">
      {children}
    </div>
  )
}
