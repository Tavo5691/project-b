import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const cancelReservationMock = vi.fn()
vi.mock('@/actions/cancel', () => ({
  cancelReservation: (...args: unknown[]) => cancelReservationMock(...args),
}))

import { CancelForm } from '@/components/public/cancel-form'

function fillAndSubmit(code: string) {
  fireEvent.change(screen.getByLabelText('Código de cancelación'), {
    target: { value: code },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar cancelación' }))
}

describe('CancelForm', () => {
  beforeEach(() => {
    cancelReservationMock.mockReset()
  })

  it('describes the expected code format through the input itself', () => {
    render(<CancelForm />)
    expect(screen.getByLabelText('Código de cancelación')).toHaveAccessibleDescription(
      /PALABRA-0000/
    )
  })

  it('shows a success message with gift and holder names on success', async () => {
    cancelReservationMock.mockResolvedValueOnce({
      success: true,
      giftName: 'Coche',
      firstName: 'Ana',
      lastName: 'Perez',
    })
    render(<CancelForm />)

    fillAndSubmit('ROSA-4821')

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Coche')
    })
    expect(screen.getByRole('status')).toHaveTextContent('Ana Perez')
  })

  it('shows the not-found message when the code does not match a reservation', async () => {
    cancelReservationMock.mockResolvedValueOnce({ success: false, error: 'not_found' })
    render(<CancelForm />)

    fillAndSubmit('BAD-0000')

    await waitFor(() => {
      expect(
        screen.getByText('No encontramos una reserva con ese código.')
      ).toBeInTheDocument()
    })
  })
})
