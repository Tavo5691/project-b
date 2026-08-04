import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FULL_SCREEN, FULL_SCREEN_COLUMN, FULL_SCREEN_FILL, NAV_H } from './shared'
import type { Settings } from '@/types/database'

/**
 * TEMPORARY — the production Baby Shower and Colores sections with nothing
 * rearranged: same markup, same element order, same inner classes.
 *
 * The only changes are container-level, all `md:` and up, so mobile is
 * untouched: the section covers one screen with the intro's thin gutter, the
 * content column spans the full width instead of a centred `max-w-3xl`, and
 * the section's main block stretches to absorb the leftover height.
 */

const navVar = { ['--nav-h' as string]: NAV_H }

export function EventInfoFullScreen({ settings }: { settings: Settings }) {
  return (
    <section
      className={cn('w-full bg-cream px-6 py-16 sm:px-12', FULL_SCREEN)}
      style={navVar}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-3xl flex-col gap-4',
          FULL_SCREEN_COLUMN,
          'md:justify-between md:gap-6'
        )}
      >
        <h1 className="font-display text-3xl uppercase text-stencil-red sm:text-5xl md:mt-10 md:text-center">
          Baby Shower
        </h1>

        <div aria-hidden="true" className="hidden md:block md:min-h-0 md:flex-[1]" />

        <div className="flex flex-col gap-4 md:gap-3">
          {/* Deliberately NOT stretched to fill the leftover height: a bordered
              box blown up to ~600px around four short lines reads as an empty
              frame. The column spreads its three blocks across the screen
              instead, so the section is covered without inflating any one box. */}
          <div className="flex flex-col justify-center gap-3 rounded-2xl border-2 border-stencil-red px-6 py-5 text-center text-sm text-text md:gap-6 md:py-8 md:text-base">
            <dl className="flex flex-col gap-2 md:gap-4">
              {settings.event_address && (
                <div className="flex justify-center gap-2">
                  <dt className="font-medium">Lugar:</dt>
                  <dd>{settings.event_address}</dd>
                </div>
              )}
              {settings.event_date && (
                <div className="flex justify-center gap-2">
                  <dt className="font-medium">Fecha:</dt>
                  <dd>{settings.event_date}</dd>
                </div>
              )}
              {settings.event_time && (
                <div className="flex justify-center gap-2">
                  <dt className="font-medium">Hora:</dt>
                  <dd>{settings.event_time}</dd>
                </div>
              )}
            </dl>

            {settings.maps_url && (
              <div className="flex justify-center">
                <a
                  href={settings.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-teal px-6 py-3 text-sm font-block uppercase text-cream transition-opacity hover:opacity-90"
                >
                  Ver en Google Maps
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {settings.cash_note && (
              <p className="flex-1 border-l-4 border-teal pl-4 text-xs uppercase text-stencil-red md:text-sm">
                {settings.cash_note}
              </p>
            )}

            <Link
              href="/regalos"
              className="w-fit shrink-0 rounded-lg bg-teal px-6 py-3 text-sm font-block uppercase text-cream transition-opacity hover:opacity-90 md:text-base"
            >
              Lista de regalos
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="hidden md:block md:min-h-0 md:flex-[4]" />
      </div>
    </section>
  )
}

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

export function ColoresFullScreen() {
  return (
    <section
      className={cn('w-full bg-intro-blue px-6 py-16 sm:px-12', FULL_SCREEN)}
      style={navVar}
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

        <div
          className={cn(FULL_SCREEN_FILL, 'md:flex md:items-center md:justify-center')}
        >
          <div className="rounded-2xl bg-cream px-5 py-4">
            <p className="border-l-4 border-teal pl-4 text-xs uppercase text-stencil-red md:text-sm">
              Colores de preferencia de los papis por si le quieres regalar alguna ropita (mentira, es
              preferencia de la mami — el papi no tiene ni idea).
            </p>
          </div>
        </div>

        {/* Still one wrapping row of swatches, exactly as in production — not
            regrouped into a grid. It just becomes this section's main block:
            it absorbs the leftover height and each circle takes an equal share
            of the width, so the colours scale up instead of staying a row of
            dots in a large empty field. */}
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
              className="h-8 w-8 rounded-full border border-black/10 md:aspect-square md:h-auto md:w-auto md:max-h-full md:flex-1"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
