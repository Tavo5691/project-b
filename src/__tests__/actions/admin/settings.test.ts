import { describe, it, expect, vi, beforeEach } from 'vitest'

const upsertMock = vi.fn()
const fromMock = vi.fn(() => ({ upsert: upsertMock }))
vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(async () => ({ from: fromMock })),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/actions/admin-auth', () => ({
  verifyAdminSession: vi.fn(async () => true),
}))

import { updateSettings } from '@/actions/admin/settings'
import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/actions/admin-auth'

function buildFormData(fields: Record<string, string>, galleryUrls: string[] = []) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  for (const url of galleryUrls) fd.append('gallery_url', url)
  return fd
}

const VALID_FIELDS = {
  welcome_title: 'Bienvenidos a la fiesta',
  welcome_subtitle: 'Nos vemos pronto',
  intro_message: 'Ya viene BabyB',
  event_date: '2026-08-01',
  event_time: '16:00',
  event_address: 'Calle Falsa 123',
  maps_url: 'https://maps.google.com/x',
  cash_note: 'También aceptamos efectivo',
  bank_name: 'Banco Test',
  bank_account: 'alias.test',
  bank_holder: 'Ana Perez',
}

describe('updateSettings', () => {
  beforeEach(() => {
    upsertMock.mockReset()
    fromMock.mockClear()
    vi.mocked(revalidatePath).mockClear()
    vi.mocked(verifyAdminSession).mockClear().mockResolvedValue(true)
  })

  it('returns error when the admin session is not verified', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValueOnce(false)
    const fd = buildFormData(VALID_FIELDS)
    const result = await updateSettings(null, fd)
    expect(result).toEqual({ success: false, error: 'Revisá los campos del formulario.' })
    expect(upsertMock).not.toHaveBeenCalled()
  })

  it('returns invalid_input error when welcome_title is missing', async () => {
    const fd = buildFormData({ ...VALID_FIELDS, welcome_title: '' })
    const result = await updateSettings(null, fd)
    expect(result).toEqual({ success: false, error: 'Revisá los campos del formulario.' })
    expect(upsertMock).not.toHaveBeenCalled()
  })

  it('upserts the settings row (id=1) and revalidates /admin and / on success', async () => {
    upsertMock.mockResolvedValueOnce({ error: null })
    const fd = buildFormData(VALID_FIELDS)
    const result = await updateSettings(null, fd)

    expect(result).toEqual({ success: true })
    expect(fromMock).toHaveBeenCalledWith('settings')
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, welcome_title: 'Bienvenidos a la fiesta', gallery_urls: [] }),
      { onConflict: 'id' }
    )
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('accepts an array of valid gallery URLs via repeated gallery_url fields', async () => {
    upsertMock.mockResolvedValueOnce({ error: null })
    const galleryUrls = ['https://example.com/a.jpg', 'https://example.com/b.jpg']
    const fd = buildFormData(VALID_FIELDS, galleryUrls)
    const result = await updateSettings(null, fd)

    expect(result).toEqual({ success: true })
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ gallery_urls: galleryUrls }),
      { onConflict: 'id' }
    )
  })

  it('rejects an invalid gallery URL', async () => {
    const fd = buildFormData(VALID_FIELDS, ['not-a-url'])
    const result = await updateSettings(null, fd)

    expect(result).toEqual({ success: false, error: 'Revisá los campos del formulario.' })
    expect(upsertMock).not.toHaveBeenCalled()
  })

  it('returns db_error message when the upsert fails', async () => {
    upsertMock.mockResolvedValueOnce({ error: { message: 'boom' } })
    const fd = buildFormData(VALID_FIELDS)
    const result = await updateSettings(null, fd)

    expect(result).toEqual({ success: false, error: 'No pudimos guardar los cambios.' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
