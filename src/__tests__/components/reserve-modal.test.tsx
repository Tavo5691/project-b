import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const reserveGiftMock = vi.fn()
vi.mock('@/actions/reserve', () => ({
  reserveGift: (...args: unknown[]) => reserveGiftMock(...args),
}))

import { ReserveModal } from '@/components/public/reserve-modal'

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Perez' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
}

describe('ReserveModal', () => {
  beforeEach(() => {
    reserveGiftMock.mockReset()
  })

  it('starts in the form state', () => {
    render(<ReserveModal giftId="gift-1" giftName="Coche" onClose={() => {}} />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar reserva' })).toBeInTheDocument()
  })

  it('transitions to the thanks state and shows the cancel code on success', async () => {
    reserveGiftMock.mockResolvedValueOnce({ success: true, cancelToken: 'ROSA-4821' })
    render(<ReserveModal giftId="gift-1" giftName="Coche" onClose={() => {}} />)

    fillAndSubmit()

    await waitFor(() => {
      expect(screen.getByText('ROSA-4821')).toBeInTheDocument()
    })
    expect(screen.getByText('Copiar código')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument()
  })

  it('transitions to the race-error state when the gift was already reserved', async () => {
    reserveGiftMock.mockResolvedValueOnce({ success: false, error: 'already_reserved' })
    render(<ReserveModal giftId="gift-1" giftName="Coche" onClose={() => {}} />)

    fillAndSubmit()

    await waitFor(() => {
      expect(screen.getByText('Ups, alguien llegó primero')).toBeInTheDocument()
    })
    expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument()
  })

  it('stays in the form state and shows an inline error on invalid input', async () => {
    reserveGiftMock.mockResolvedValueOnce({ success: false, error: 'invalid_input' })
    render(<ReserveModal giftId="gift-1" giftName="Coche" onClose={() => {}} />)

    fillAndSubmit()

    await waitFor(() => {
      expect(
        screen.getByText('Completá tu nombre y apellido para reservar.')
      ).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })
})
