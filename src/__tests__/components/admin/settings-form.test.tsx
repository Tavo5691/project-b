import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const updateSettingsMock = vi.fn()
vi.mock('@/actions/admin/settings', () => ({
  updateSettings: (...args: unknown[]) => updateSettingsMock(...args),
}))

import { SettingsForm } from '@/components/admin/settings-form'
import type { Settings } from '@/types/database'

const settings: Settings = {
  id: 1,
  welcome_title: 'Bienvenidos',
  intro_message_1: 'Ya viene BabyB',
  intro_message_2: 'No se lo pierdan',
  event_date: '2026-08-01',
  event_time: '16:00',
  event_address: 'Calle Falsa 123',
  maps_url: 'https://maps.google.com/x',
  cash_note: 'Aceptamos efectivo',
  gallery_urls: [],
}

describe('SettingsForm', () => {
  beforeEach(() => {
    updateSettingsMock.mockReset()
  })

  it('pre-populates fields from the current settings row', () => {
    render(<SettingsForm settings={settings} />)
    expect(screen.getByLabelText('Título de bienvenida')).toHaveValue('Bienvenidos')
    // Second field asserted so this covers the loop over FIELDS, not just its
    // first entry. Was 'Banco' until the bank details were removed from the
    // public site and this form.
    expect(screen.getByLabelText('Dirección')).toHaveValue('Calle Falsa 123')
  })

  it('pre-populates the gallery URL list from settings.gallery_urls', () => {
    render(
      <SettingsForm
        settings={{ ...settings, gallery_urls: ['https://example.com/a.jpg'] }}
      />
    )
    expect(screen.getByDisplayValue('https://example.com/a.jpg')).toBeInTheDocument()
  })

  it('adds a new empty gallery URL row when "Agregar foto" is clicked', () => {
    render(<SettingsForm settings={{ ...settings, gallery_urls: [] }} />)
    expect(screen.queryAllByPlaceholderText('https://...')).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Agregar foto' }))
    expect(screen.getAllByPlaceholderText('https://...')).toHaveLength(1)
  })

  it('removes a gallery URL row when its "Quitar" button is clicked', () => {
    render(
      <SettingsForm
        settings={{
          ...settings,
          gallery_urls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
        }}
      />
    )
    expect(screen.getAllByPlaceholderText('https://...')).toHaveLength(2)
    fireEvent.click(screen.getAllByRole('button', { name: 'Quitar' })[0])
    expect(screen.getAllByPlaceholderText('https://...')).toHaveLength(1)
    expect(screen.getByDisplayValue('https://example.com/b.jpg')).toBeInTheDocument()
  })

  it('shows a success message after saving', async () => {
    updateSettingsMock.mockResolvedValueOnce({ success: true })
    render(<SettingsForm settings={settings} />)

    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Los cambios se guardaron correctamente.')
    })
  })

  it('shows the error message when saving fails', async () => {
    updateSettingsMock.mockResolvedValueOnce({
      success: false,
      error: 'No pudimos guardar los cambios.',
    })
    render(<SettingsForm settings={settings} />)

    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No pudimos guardar los cambios.')
    })
  })

  it('renders gracefully when gallery_urls is undefined (pre-migration data)', () => {
    render(
      <SettingsForm
        settings={
          {
            ...settings,
            gallery_urls: undefined,
          } as unknown as Settings
        }
      />
    )
    expect(screen.getByRole('button', { name: 'Agregar foto' })).toBeInTheDocument()
    expect(screen.queryAllByPlaceholderText('https://...')).toHaveLength(0)
  })
})
