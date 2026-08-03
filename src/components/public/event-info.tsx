import Link from 'next/link'
import type { Settings } from '@/types/database'

interface EventInfoProps {
  settings: Settings
}

/**
 * The "BABY SHOWER" section: static stencil-red headline (welcome_title is
 * intentionally not rendered here — it already shows on the `/` splash
 * page), a bracket-style bordered box for Lugar/Fecha/Hora, and the "Lista
 * de regalos" CTA.
 *
 * Field order follows the design comp (Lugar first), which differs from the
 * order the fields are declared in on the settings row.
 */
export function EventInfo({ settings }: EventInfoProps) {
  return (
    <section className="w-full bg-cream px-6 py-16 sm:px-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <h1 className="font-display text-3xl uppercase text-stencil-red sm:text-5xl">
          Baby Shower
        </h1>

        {/* The bordered box wraps the field list *and* the maps CTA, but the
            `<dl>` itself holds only real dt/dd pairs — a bare `<div>` inside a
            definition list is invalid markup. */}
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-stencil-red px-6 py-5 text-center text-sm text-text">
          <dl className="flex flex-col gap-2">
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
            <p className="flex-1 border-l-4 border-teal pl-4 text-xs uppercase text-stencil-red">
              {settings.cash_note}
            </p>
          )}

          <Link
            href="/regalos"
            className="w-fit shrink-0 rounded-lg bg-teal px-6 py-3 text-sm font-block uppercase text-cream transition-opacity hover:opacity-90"
          >
            Lista de regalos
          </Link>
        </div>
      </div>
    </section>
  )
}
