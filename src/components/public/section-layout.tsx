import { cn } from '@/lib/utils'

/**
 * Shared layout primitives for the public invitation sections.
 *
 * Every section covers exactly one screen on desktop and keeps its original
 * stacked layout on phones — all of this is `md:` and up, so the mobile
 * design is untouched by anything here.
 *
 * `svh` rather than `vh` so mobile browser chrome can't push a section past
 * the fold. `--nav-h` matches the sticky navbar's measured height; if the
 * navbar's padding or type size ever changes, re-measure and update it here,
 * otherwise sections will overflow the viewport by the difference.
 */

export const NAV_H = '3.0625rem' // 49px — navbar py-4 + its 10px/12px line box

/** Viewport height minus the nav and the section's own top/bottom gutter. */
export const SPLIT_HEIGHT = 'md:h-[calc(100svh-var(--nav-h)-1.5rem)]'

/**
 * Applies to the outer `<section>`: covers one screen with a thin gutter,
 * content spanning the full width rather than a centred column.
 *
 * `md:px-10` rather than the intro's tighter gutter because these sections
 * lead with type — at 12px, headlines sit almost against the screen edge.
 */
export const FULL_SCREEN =
  'md:flex md:h-[calc(100svh-var(--nav-h))] md:min-h-[34rem] md:px-10 md:py-3 lg:px-16'

/** The content column inside a `FULL_SCREEN` section. */
export const FULL_SCREEN_COLUMN = 'md:h-full md:max-w-none'

/**
 * Marks the block that absorbs the section's leftover vertical space — the
 * analogue of the intro's two panels filling their halves. Without it the
 * content hugs the top and the section reads as mostly empty.
 */
export const FULL_SCREEN_FILL = 'md:min-h-0 md:flex-1'

interface SplitSectionProps {
  /** Background utility for the whole band, e.g. `bg-cream`. */
  bg: string
  /** Max width of the stacked mobile column. */
  mobileMaxWidth: string
  /** Gap between stacked blocks on mobile. */
  mobileGap: string
  left: React.ReactNode
  right: React.ReactNode
}

/**
 * A section split 50/50 on desktop, stacked on mobile. Currently only the
 * intro uses it; the other sections cover the screen as a single column via
 * `FULL_SCREEN` instead.
 */
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
