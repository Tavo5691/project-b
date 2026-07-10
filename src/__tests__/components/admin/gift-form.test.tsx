import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const createGiftMock = vi.fn()
const updateGiftMock = vi.fn()
vi.mock('@/actions/admin/gifts', () => ({
  createGift: (...args: unknown[]) => createGiftMock(...args),
  updateGift: (...args: unknown[]) => updateGiftMock(...args),
}))

import { GiftForm } from '@/components/admin/gift-form'
import type { Category, Gift } from '@/types/database'

const categories: Category[] = [
  { id: 'cat-1', name: 'Cocina', created_at: '' },
  { id: 'cat-2', name: 'Bebé', created_at: '' },
]

const existingGift: Gift = {
  id: 'gift-1',
  category_id: 'cat-1',
  name: 'Olla',
  description: 'Olla grande',
  image_url: '',
  external_link: '',
  status: 'available',
  price: 0,
  created_at: '',
}

describe('GiftForm', () => {
  beforeEach(() => {
    createGiftMock.mockReset()
    updateGiftMock.mockReset()
  })

  it('renders empty fields and calls createGift in create mode', async () => {
    const onClose = vi.fn()
    createGiftMock.mockResolvedValueOnce({ success: true })
    render(<GiftForm categories={categories} onClose={onClose} />)

    expect(screen.getByLabelText('Nombre')).toHaveValue('')
    expect(screen.getByLabelText('Precio')).toHaveValue(null)
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Coche' } })
    fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '15000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() => {
      expect(createGiftMock).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('pre-populates fields, including price, and calls updateGift in edit mode', async () => {
    const onClose = vi.fn()
    updateGiftMock.mockResolvedValueOnce({ success: true })
    render(<GiftForm categories={categories} gift={{ ...existingGift, price: 8000 }} onClose={onClose} />)

    expect(screen.getByLabelText('Nombre')).toHaveValue('Olla')
    expect(screen.getByLabelText('Precio')).toHaveValue(8000)
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() => {
      expect(updateGiftMock).toHaveBeenCalled()
    })
    expect(createGiftMock).not.toHaveBeenCalled()
  })

  it('shows an inline error and does not close when saving fails', async () => {
    const onClose = vi.fn()
    createGiftMock.mockResolvedValueOnce({ success: false, error: 'db_error' })
    render(<GiftForm categories={categories} onClose={onClose} />)

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Coche' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No pudimos guardar el regalo.')
    })
    expect(onClose).not.toHaveBeenCalled()
  })
})
