import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const deleteGiftMock = vi.fn()
vi.mock('@/actions/admin/gifts', () => ({
  createGift: vi.fn(),
  updateGift: vi.fn(),
  deleteGift: (...args: unknown[]) => deleteGiftMock(...args),
}))

import { GiftsPanel } from '@/components/admin/gifts-panel'
import type { Category, GiftWithCategory } from '@/types/database'

const categories: Category[] = [
  { id: 'cat-1', name: 'Cocina', created_at: '' },
  { id: 'cat-2', name: 'Bebé', created_at: '' },
]

function makeGift(overrides: Partial<GiftWithCategory>): GiftWithCategory {
  return {
    id: 'gift-id',
    category_id: 'cat-1',
    name: 'Regalo',
    description: '',
    image_url: '',
    external_link: '',
    status: 'available',
    price: 0,
    created_at: '',
    category: categories[0],
    ...overrides,
  }
}

const gifts: GiftWithCategory[] = [
  makeGift({ id: 'g1', category_id: 'cat-1', name: 'Olla', price: 15000, category: categories[0] }),
  makeGift({ id: 'g2', category_id: 'cat-2', name: 'Chupete', price: 0, category: categories[1] }),
]

describe('GiftsPanel', () => {
  beforeEach(() => {
    deleteGiftMock.mockReset()
  })

  it('lists all gifts with their category and status', () => {
    render(<GiftsPanel gifts={gifts} categories={categories} />)
    expect(screen.getByText('Olla')).toBeInTheDocument()
    expect(screen.getByText('Chupete')).toBeInTheDocument()
    expect(screen.getAllByText('Cocina').length).toBeGreaterThan(0)
  })

  it('shows the formatted price for a priced gift', () => {
    render(<GiftsPanel gifts={gifts} categories={categories} />)
    expect(screen.getByText('$15.000')).toBeInTheDocument()
  })

  it('shows no price text for an unpriced (price=0) gift', () => {
    render(<GiftsPanel gifts={gifts} categories={categories} />)
    expect(screen.queryByText('$0')).not.toBeInTheDocument()
  })

  it('filters gifts by category', () => {
    render(<GiftsPanel gifts={gifts} categories={categories} />)
    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), {
      target: { value: 'cat-2' },
    })
    expect(screen.getByText('Chupete')).toBeInTheDocument()
    expect(screen.queryByText('Olla')).not.toBeInTheDocument()
  })

  it('opens the create modal when "Agregar regalo" is clicked', () => {
    render(<GiftsPanel gifts={gifts} categories={categories} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agregar regalo' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Nuevo regalo')).toBeInTheDocument()
  })

  it('opens the edit modal pre-populated when "Editar" is clicked on a row', () => {
    render(<GiftsPanel gifts={gifts} categories={categories} />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    expect(screen.getByText('Editar regalo')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Olla')
  })

  it('removes the gift from view after a successful delete', async () => {
    deleteGiftMock.mockResolvedValueOnce({ success: true })
    render(<GiftsPanel gifts={gifts} categories={categories} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    await waitFor(() => {
      expect(screen.queryByText('Olla')).not.toBeInTheDocument()
    })
  })
})
