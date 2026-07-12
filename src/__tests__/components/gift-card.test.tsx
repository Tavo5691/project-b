import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GiftCard } from '@/components/public/gift-card'
import type { Gift } from '@/types/database'

function makeGift(overrides: Partial<Gift>): Gift {
  return {
    id: 'gift-1',
    category_id: 'cat-1',
    name: 'Coche de bebé',
    description: '',
    image_url: '',
    external_link: '',
    status: 'available',
    price: 0,
    created_at: '',
    ...overrides,
  }
}

describe('GiftCard price display', () => {
  it('hides the price entirely when price is 0, gift stays reservable', () => {
    const gift = makeGift({ price: 0 })
    render(<GiftCard gift={gift} onReserve={vi.fn()} />)
    expect(screen.queryByText('$0')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reservar' })).toBeEnabled()
  })

  it('shows the formatted ARS price when price is greater than 0', () => {
    const gift = makeGift({ price: 15000 })
    render(<GiftCard gift={gift} onReserve={vi.fn()} />)
    expect(screen.getByText('$15.000')).toBeInTheDocument()
  })

  it('still shows the price on a reserved gift', () => {
    const gift = makeGift({ price: 8000, status: 'reserved' })
    render(<GiftCard gift={gift} onReserve={vi.fn()} />)
    expect(screen.getByText('$8.000')).toBeInTheDocument()
  })
})
