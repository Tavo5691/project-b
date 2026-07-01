import type { Settings } from '@/types/database'

interface EventInfoProps {
  settings: Settings
}

export function EventInfo({ settings }: EventInfoProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg bg-card-bg p-6">
      <h1 className="text-2xl font-bold text-primary">{settings.welcome_title}</h1>
      {settings.welcome_subtitle && (
        <p className="text-text-muted">{settings.welcome_subtitle}</p>
      )}

      <dl className="flex flex-col gap-1 text-sm text-text">
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
      </dl>

      {settings.maps_url && (
        <a
          href={settings.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Ver en Google Maps
        </a>
      )}

      {settings.cash_note && (
        <p className="text-sm italic text-text-muted">{settings.cash_note}</p>
      )}
    </section>
  )
}
