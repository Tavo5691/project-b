import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/actions/admin/settings', () => ({ updateSettings: vi.fn() }))
vi.mock('@/actions/admin/categories', () => ({
  createCategory: vi.fn(),
  renameCategory: vi.fn(),
  deleteCategory: vi.fn(),
}))
vi.mock('@/actions/admin/gifts', () => ({
  createGift: vi.fn(),
  updateGift: vi.fn(),
  deleteGift: vi.fn(),
}))
vi.mock('@/actions/admin/reservations', () => ({ adminCancelReservation: vi.fn() }))

import { AdminTabs } from '@/components/admin/admin-tabs'
import type { Category, GiftWithCategory, ReservationWithGift, Settings } from '@/types/database'

const settings: Settings = {
  id: 1,
  welcome_title: 'Bienvenidos',
  welcome_subtitle: '',
  event_date: '',
  event_time: '',
  event_address: '',
  maps_url: '',
  cash_note: '',
  bank_name: '',
  bank_account: '',
  bank_holder: '',
  gallery_urls: [],
}

const categories: Category[] = [{ id: 'cat-1', name: 'Cocina', created_at: '' }]

const gifts: GiftWithCategory[] = [
  {
    id: 'gift-1',
    category_id: 'cat-1',
    name: 'Olla',
    description: '',
    image_url: '',
    external_link: '',
    status: 'available',
    price: 0,
    created_at: '',
    category: categories[0],
  },
]

const reservations: ReservationWithGift[] = []

describe('AdminTabs', () => {
  it('shows the Settings panel by default', () => {
    render(
      <AdminTabs
        settings={settings}
        categories={categories}
        gifts={gifts}
        reservations={reservations}
      />
    )
    expect(screen.getByLabelText('Título de bienvenida')).toBeInTheDocument()
  })

  it('switches to the Categories panel when its tab is clicked', () => {
    render(
      <AdminTabs
        settings={settings}
        categories={categories}
        gifts={gifts}
        reservations={reservations}
      />
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Categorías' }))
    expect(screen.getByText('Cocina')).toBeInTheDocument()
    expect(screen.queryByLabelText('Título de bienvenida')).not.toBeInTheDocument()
  })

  it('switches to the Gifts panel when its tab is clicked', () => {
    render(
      <AdminTabs
        settings={settings}
        categories={categories}
        gifts={gifts}
        reservations={reservations}
      />
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Regalos' }))
    expect(screen.getByText('Olla')).toBeInTheDocument()
  })

  it('switches to the Reservations panel when its tab is clicked', () => {
    render(
      <AdminTabs
        settings={settings}
        categories={categories}
        gifts={gifts}
        reservations={reservations}
      />
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Reservas' }))
    expect(screen.getByText('Todavía no hay reservas.')).toBeInTheDocument()
  })
})
