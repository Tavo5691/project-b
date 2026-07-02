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

import { createCategory, renameCategory, deleteCategory } from '@/actions/admin/categories'
import { revalidatePath } from 'next/cache'

function buildFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

describe('createCategory', () => {
  beforeEach(() => {
    insertMock.mockReset()
    fromMock.mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  it('returns invalid_input when name is empty', async () => {
    const result = await createCategory(null, buildFormData({ name: '' }))
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('inserts the category and revalidates /admin on success', async () => {
    insertMock.mockResolvedValueOnce({ error: null })
    const result = await createCategory(null, buildFormData({ name: 'Cocina' }))
    expect(result).toEqual({ success: true })
    expect(fromMock).toHaveBeenCalledWith('categories')
    expect(insertMock).toHaveBeenCalledWith({ name: 'Cocina' })
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
  })
})

describe('renameCategory', () => {
  beforeEach(() => {
    updateEqMock.mockReset()
    updateMock.mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  it('returns invalid_input when category_id is missing', async () => {
    const result = await renameCategory(null, buildFormData({ name: 'Nueva' }))
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('updates the category name and revalidates /admin on success', async () => {
    updateEqMock.mockResolvedValueOnce({ error: null })
    const result = await renameCategory(
      null,
      buildFormData({ category_id: 'cat-1', name: 'Renovado' })
    )
    expect(result).toEqual({ success: true })
    expect(updateMock).toHaveBeenCalledWith({ name: 'Renovado' })
    expect(updateEqMock).toHaveBeenCalledWith('id', 'cat-1')
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
  })
})

describe('deleteCategory', () => {
  beforeEach(() => {
    deleteEqMock.mockReset()
    deleteMock.mockClear()
    vi.mocked(revalidatePath).mockClear()
  })

  it('deletes the category and revalidates /admin on success', async () => {
    deleteEqMock.mockResolvedValueOnce({ error: null })
    const result = await deleteCategory('cat-1')
    expect(result).toEqual({ success: true })
    expect(deleteEqMock).toHaveBeenCalledWith('id', 'cat-1')
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
  })

  it('returns has_gifts when the FK RESTRICT constraint blocks the delete', async () => {
    deleteEqMock.mockResolvedValueOnce({ error: { code: '23503', message: 'FK violation' } })
    const result = await deleteCategory('cat-1')
    expect(result).toEqual({ success: false, error: 'has_gifts' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns db_error for any other database error', async () => {
    deleteEqMock.mockResolvedValueOnce({ error: { code: '500', message: 'oops' } })
    const result = await deleteCategory('cat-1')
    expect(result).toEqual({ success: false, error: 'db_error' })
  })
})
