import { cn } from '@/lib/utils'
import {
  FULL_SCREEN,
  FULL_SCREEN_COLUMN,
  FULL_SCREEN_FILL,
  NAV_H,
} from '@/components/public/section-layout'

const COLOR_SWATCHES: string[] = [
  '#16324a',
  '#5a5a5a',
  '#1e3a2c',
  '#d99a2b',
  '#a13a1a',
  '#d9c0a3',
  '#eef1f4',
  '#d13c22',
  '#7a6a4a',
]

/**
 * "Colores" section — sits on `intro-blue`, which drives the page's
 * blue/cream alternation.
 *
 * Two deliberate deviations from the design comp, both contrast-driven. The
 * headline is `teal-dark` rather than `stencil-red`: red on this blue is
 * ~2.1:1 and fails AA even at display sizes, while teal-dark reaches 3.41:1
 * and clears the 3:1 large-text threshold at this size and weight. The body
 * copy sits inside a cream card instead of directly on the blue — small
 * uppercase text has no compliant ink on this background, so it needs a
 * different surface rather than a different colour.
 *
 * Desktop: the note is centred in the space between headline and swatches,
 * and the swatch row sits at the top of its own space so it reads closer to
 * the note. Each circle takes an equal share of the width; nine in one row
 * can't also fill the height, so some empty blue below is expected and was
 * reviewed and accepted.
 */
export function ColoresSection() {
  return (
    <section
      className={cn('w-full bg-intro-blue px-6 py-16 sm:px-12', FULL_SCREEN)}
      style={{ ['--nav-h' as string]: NAV_H }}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-3xl flex-col gap-4',
          FULL_SCREEN_COLUMN,
          'md:gap-6'
        )}
      >
        <h2 className="font-display text-3xl uppercase text-teal-dark sm:text-5xl md:mt-10 md:text-center">
          Colores
        </h2>

        <div className={cn(FULL_SCREEN_FILL, 'md:flex md:items-center md:justify-center')}>
          <div className="rounded-2xl bg-cream px-5 py-4">
            <p className="border-l-4 border-teal pl-4 text-xs uppercase text-stencil-red md:text-sm">
              Colores de preferencia de los papis por si le quieres regalar alguna ropita (mentira,
              es preferencia de la mami — el papi no tiene ni idea).
            </p>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-wrap items-center gap-3 pt-1',
            FULL_SCREEN_FILL,
            'md:flex-nowrap md:items-start md:gap-6 md:pt-0'
          )}
        >
          {COLOR_SWATCHES.map((hex) => (
            <div
              key={hex}
              /* `aspect-square` keeps them true circles rather than ellipses,
                 since a stretched flex child is not square; `max-h-full` stops
                 a short viewport from pushing a circle out of the row. */
              className="h-8 w-8 rounded-full border border-black/10 md:aspect-square md:h-auto md:w-auto md:max-h-full md:flex-1"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
