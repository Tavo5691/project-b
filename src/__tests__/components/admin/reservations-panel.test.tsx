import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const adminCancelReservationMock = vi.fn()
vi.mock('@/actions/admin/reservations', () => ({
  adminCancelReservation: (...args: unknown[]) => adminCancelReservationMock(...args),
}))

import { ReservationsPanel } from '@/components/admin/reservations-panel'
import type { ReservationWithGift } from '@/types/database'

const reservations: ReservationWithGift[] = [
  {
    id: 'res-1',
    gift_id: 'gift-1',
    first_name: 'Ana',
    last_name: 'Perez',
    message: 'Con mucho cariño',
    cancel_token: 'ROSA-4821',
    created_at: '2026-06-01T10:00:00.000Z',
    gift: {
      id: 'gift-1',
      category_id: 'cat-1',
      name: 'Coche',
      description: '',
      image_url: '',
      external_link: '',
      status: 'reserved',
      price: 0,
      created_at: '',
    },
  },
]

describe('ReservationsPanel', () => {
  beforeEach(() => {
    adminCancelReservationMock.mockReset()
  })

  it('shows a table row with gift name, guest name, message, and date', () => {
    render(<ReservationsPanel reservations={reservations} />)
    expect(screen.getByText('Coche')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Con mucho cariño')).toBeInTheDocument()
  })

  it('shows an empty state message when there are no reservations', () => {
    render(<ReservationsPanel reservations={[]} />)
    expect(screen.getByText('Todavía no hay reservas.')).toBeInTheDocument()
  })

  it('removes the row from view after a successful cancel', async () => {
    adminCancelReservationMock.mockResolvedValueOnce({ success: true })
    render(<ReservationsPanel reservations={reservations} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => {
      expect(screen.queryByText('Coche')).not.toBeInTheDocument()
    })
    expect(adminCancelReservationMock).toHaveBeenCalledWith('res-1')
  })

  it('shows an error and keeps the row when the cancel fails', async () => {
    adminCancelReservationMock.mockResolvedValueOnce({ success: false, error: 'db_error' })
    render(<ReservationsPanel reservations={reservations} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No pudimos cancelar la reserva.')
    })
    expect(screen.getByText('Coche')).toBeInTheDocument()
  })
})
