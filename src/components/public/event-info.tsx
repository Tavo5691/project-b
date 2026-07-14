import Link from 'next/link'
import type { Settings } from '@/types/database'

interface EventInfoProps {
  settings: Settings
}

/**
 * The "BABY SHOWER" section from the design PDF: static stencil-red
 * headline (welcome_title is intentionally not rendered here — it already
 * shows on the `/` splash page), a bracket-style bordered box for
 * Fecha/Hora/Lugar, and the "Lista de regalos" CTA (moved in from
 * `invitacion/page.tsx` in PR3).
 */
export function EventInfo({ settings }: EventInfoProps) {
  return (
    <section className="flex flex-col gap-4 p-6">
      <h1 className="font-display text-3xl uppercase text-stencil-red sm:text-5xl">
        Baby Shower
      </h1>

      <dl className="flex flex-col gap-2 rounded-2xl border-2 border-stencil-red px-6 py-4 text-sm text-text">
        {settings.event_date && (
          <div className="flex gap-2">
            <dt className="font-medium">Fecha:</dt>
            <dd>{settings.event_date}</dd>
          </div>
        )}
        {settings.event_time && (
          <div className="flex gap-2">
            <dt className="font-medium">Hora:</dt>
            <dd>{settings.event_time}</dd>
          </div>
        )}
        {settings.event_address && (
          <div className="flex gap-2">
            <dt className="font-medium">Lugar:</dt>
            <dd>{settings.event_address}</dd>
          </div>
        )}
        {settings.maps_url && (
          <div className="flex gap-2">
            <dt className="font-medium">Mapa:</dt>
            <dd>
              <a
                href={settings.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-teal px-6 py-3 text-sm font-block uppercase text-cream transition-opacity hover:opacity-90"
              >
                Ver en Google Maps
              </a>
            </dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {settings.cash_note && (
          <p className="text-sm italic text-teal-dark">{settings.cash_note}</p>
        )}

        <Link
          href="/regalos"
          className="w-fit rounded-lg bg-teal px-6 py-3 text-sm font-block uppercase text-cream transition-opacity hover:opacity-90"
        >
          Lista de regalos
        </Link>
      </div>
    </section>
  )
}
