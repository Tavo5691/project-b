'use client'

import { useActionState, useState } from 'react'
import { updateSettings, type SettingsResult } from '@/actions/admin/settings'
import type { Settings } from '@/types/database'

interface SettingsFormProps {
  settings: Settings
}

const FIELDS: { name: keyof Omit<Settings, 'id'>; label: string; multiline?: boolean }[] = [
  { name: 'welcome_title', label: 'Título de bienvenida' },
  { name: 'welcome_subtitle', label: 'Subtítulo' },
  { name: 'event_date', label: 'Fecha del evento' },
  { name: 'event_time', label: 'Hora del evento' },
  { name: 'event_address', label: 'Dirección' },
  { name: 'maps_url', label: 'Link de Google Maps' },
  { name: 'cash_note', label: 'Nota sobre efectivo', multiline: true },
  { name: 'bank_name', label: 'Banco' },
  { name: 'bank_account', label: 'Cuenta / Alias' },
  { name: 'bank_holder', label: 'Titular de la cuenta' },
]

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, action, isPending] = useActionState<SettingsResult | null, FormData>(
    updateSettings,
    null
  )
  const [galleryUrls, setGalleryUrls] = useState<string[]>(settings.gallery_urls ?? [])

  function addGalleryUrl() {
    setGalleryUrls((current) => [...current, ''])
  }

  function removeGalleryUrl(index: number) {
    setGalleryUrls((current) => current.filter((_, i) => i !== index))
  }

  function updateGalleryUrl(index: number, value: string) {
    setGalleryUrls((current) => current.map((url, i) => (i === index ? value : url)))
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {FIELDS.map((field) =>
        field.multiline ? (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-text">
              {field.label}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={2}
              defaultValue={settings[field.name]}
              className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>
        ) : (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-text">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              defaultValue={settings[field.name]}
              className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>
        )
      )}

      <div>
        <span className="mb-1 block text-sm font-medium text-text">
          Fotos de la galería
        </span>
        <div className="flex flex-col gap-2">
          {galleryUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                name="gallery_url"
                value={url}
                placeholder="https://..."
                onChange={(event) => updateGalleryUrl(index, event.target.value)}
                className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
              />
              <button
                type="button"
                onClick={() => removeGalleryUrl(index)}
                className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addGalleryUrl}
          className="mt-2 rounded border border-border px-3 py-1 text-xs font-medium text-text"
        >
          Agregar foto
        </button>
      </div>

      {state?.success && (
        <p className="rounded bg-card-bg p-3 text-sm text-text" role="status">
          Los cambios se guardaron correctamente.
        </p>
      )}
      {state && !state.success && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
      >
        {isPending ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}
