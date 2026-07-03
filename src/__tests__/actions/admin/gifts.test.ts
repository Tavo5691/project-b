import { describe, it, expect, vi, beforeEach } from 'vitest'

const insertMock = vi.fn()
const updateEqMock = vi.fn()
const updateMock = vi.fn(() => ({ eq: updateEqMock }))
const deleteEqMock = vi.fn()
const deleteMock = vi.fn(() => ({ eq: deleteEqMock }))
const fromMock = vi.fn(() => ({
  insert: insertMock,
  update: updateMock,
  delete: deleteMock,
}))
vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(async () => ({ from: fromMock })),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createGift, updateGift, deleteGift } from '@/actions/admin/gifts'
import { revalidatePath } from 'next/cache'

function buildFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

const VALID_GIFT = {
  category_id: 'cat-1',
  name: 'Coche de bebé',
  description: 'Coche 3 en 1',
  image_url: 'https://example.com/img.png',
  external_link: 'https://example.com/product',
}

describe('createGift', () => {
  beforeEach(() => {
    insertMock.mockReset()
    fromMock.mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  it('returns invalid_input when name is missing', async () => {
    const result = await createGift(null, buildFormData({ ...VALID_GIFT, name: '' }))
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('returns invalid_input when category_id is missing', async () => {
    const result = await createGift(null, buildFormData({ ...VALID_GIFT, category_id: '' }))
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('creates the gift as available and revalidates / and /admin', async () => {
    insertMock.mockResolvedValueOnce({ error: null })
    const result = await createGift(null, buildFormData(VALID_GIFT))
    expect(result).toEqual({ success: true })
    expect(fromMock).toHaveBeenCalledWith('gifts')
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Coche de bebé', status: 'available' })
    )
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('updateGift', () => {
  beforeEach(() => {
    updateEqMock.mockReset()
    updateMock.mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  it('returns invalid_input when gift_id is missing', async () => {
    const result = await updateGift(null, buildFormData(VALID_GIFT))
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('updates the gift and revalidates / and /admin on success', async () => {
    updateEqMock.mockResolvedValueOnce({ error: null })
    const result = await updateGift(
      null,
      buildFormData({ ...VALID_GIFT, gift_id: 'gift-1', name: 'Coche actualizado' })
    )
    expect(result).toEqual({ success: true })
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Coche actualizado' })
    )
    expect(updateEqMock).toHaveBeenCalledWith('id', 'gift-1')
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('deleteGift', () => {
  beforeEach(() => {
    deleteEqMock.mockReset()
    deleteMock.mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  it('deletes the gift and revalidates / and /admin on success', async () => {
    deleteEqMock.mockResolvedValueOnce({ error: null })
    const result = await deleteGift('gift-1')
    expect(result).toEqual({ success: true })
    expect(deleteEqMock).toHaveBeenCalledWith('id', 'gift-1')
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns db_error when the delete fails', async () => {
    deleteEqMock.mockResolvedValueOnce({ error: { code: '500', message: 'oops' } })
    const result = await deleteGift('gift-1')
    expect(result).toEqual({ success: false, error: 'db_error' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
