import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryTabs } from '@/components/public/category-tabs'
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
  makeGift({ id: 'g1', category_id: 'cat-1', name: 'Olla', category: categories[0] }),
  makeGift({ id: 'g2', category_id: 'cat-2', name: 'Chupete', category: categories[1] }),
]

describe('CategoryTabs', () => {
  it('shows only the first category gifts by default', () => {
    render(<CategoryTabs categories={categories} gifts={gifts} />)
    expect(screen.getByText('Olla')).toBeInTheDocument()
    expect(screen.queryByText('Chupete')).not.toBeInTheDocument()
  })

  it('filters gifts client-side when a different tab is selected', () => {
    render(<CategoryTabs categories={categories} gifts={gifts} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Bebé' }))
    expect(screen.getByText('Chupete')).toBeInTheDocument()
    expect(screen.queryByText('Olla')).not.toBeInTheDocument()
  })

  it('shows the empty-category message when the active tab has no gifts', () => {
    const onlyKitchenGifts = [gifts[0]]
    render(<CategoryTabs categories={categories} gifts={onlyKitchenGifts} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Bebé' }))
    expect(
      screen.getByText(/Todos los regalos de esta categoría ya están reservados/)
    ).toBeInTheDocument()
  })

  it('shows the empty-category message alongside the still-visible reserved gifts', () => {
    const allReservedGifts: GiftWithCategory[] = [
      makeGift({ id: 'g1', category_id: 'cat-1', name: 'Olla', status: 'reserved' }),
      makeGift({ id: 'g2', category_id: 'cat-2', name: 'Chupete', status: 'available' }),
    ]
    render(<CategoryTabs categories={categories} gifts={allReservedGifts} />)
    expect(
      screen.getByText(/Todos los regalos de esta categoría ya están reservados/)
    ).toBeInTheDocument()
    expect(screen.getByText('Olla')).toBeInTheDocument()
  })

  it('keeps the product link visible for a reserved gift in a fully-reserved category', () => {
    const allReservedGifts: GiftWithCategory[] = [
      makeGift({
        id: 'g1',
        category_id: 'cat-1',
        name: 'Olla',
        status: 'reserved',
        external_link: 'https://example.com/olla',
      }),
    ]
    render(<CategoryTabs categories={categories} gifts={allReservedGifts} />)
    expect(screen.getByRole('link', { name: 'Ver producto' })).toHaveAttribute(
      'href',
      'https://example.com/olla'
    )
  })

  it('shows a mixed category normally, with reserved gifts still visible', () => {
    const mixed: GiftWithCategory[] = [
      makeGift({ id: 'g1', category_id: 'cat-1', name: 'Olla', status: 'reserved' }),
      makeGift({ id: 'g2', category_id: 'cat-1', name: 'Batidora', status: 'available' }),
    ]
    render(<CategoryTabs categories={categories} gifts={mixed} />)
    expect(screen.getByText('Olla')).toBeInTheDocument()
    expect(screen.getByText('Batidora')).toBeInTheDocument()
    expect(screen.getByText('Reservado')).toBeInTheDocument()
  })

  it('sorts gifts alphabetically as provided by the caller (no client re-sort)', () => {
    const sorted: GiftWithCategory[] = [
      makeGift({ id: 'a', category_id: 'cat-1', name: 'Aspiradora' }),
      makeGift({ id: 'b', category_id: 'cat-1', name: 'Batidora' }),
    ]
    render(<CategoryTabs categories={categories} gifts={sorted} />)
    const names = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
    expect(names).toEqual(['Aspiradora', 'Batidora'])
  })
})
