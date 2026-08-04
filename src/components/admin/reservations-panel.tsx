'use client'

import { useState, useTransition } from 'react'
import { adminCancelReservation } from '@/actions/admin/reservations'
import type { ReservationWithGift } from '@/types/database'

interface ReservationsPanelProps {
  reservations: ReservationWithGift[]
}

const CANCEL_ERROR_MESSAGE = 'No pudimos cancelar la reserva.'

function formatDate(isoDate: string): string {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleDateString('es-AR')
}

export function ReservationsPanel({ reservations: initial }: ReservationsPanelProps) {
  const [reservations, setReservations] = useState(initial)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)
  const [isCanceling, startCancelTransition] = useTransition()

  function handleCancel(reservationId: string) {
    setCancelingId(reservationId)
    setErrorId(null)
    startCancelTransition(async () => {
      const result = await adminCancelReservation(reservationId)
      if (result.success) {
        setReservations((current) => current.filter((res) => res.id !== reservationId))
      } else {
        setErrorId(reservationId)
      }
      setCancelingId(null)
    })
  }

  if (reservations.length === 0) {
    return <p className="text-sm text-text-muted">Todavía no hay reservas.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted">
            <th className="py-2 pr-2 font-medium">Regalo</th>
            <th className="py-2 pr-2 font-medium">Nombre</th>
            <th className="py-2 pr-2 font-medium">Mensaje</th>
            <th className="py-2 pr-2 font-medium">Fecha</th>
            <th className="py-2 pr-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b border-border align-top">
              <td className="py-2 pr-2 text-text">{reservation.gift.name}</td>
              <td className="py-2 pr-2 text-text">{reservation.first_name}</td>
              <td className="py-2 pr-2 text-text-muted">{reservation.message}</td>
              <td className="py-2 pr-2 text-text-muted">{formatDate(reservation.created_at)}</td>
              <td className="py-2 pr-2">
                <button
                  type="button"
                  onClick={() => handleCancel(reservation.id)}
                  disabled={isCanceling && cancelingId === reservation.id}
                  className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 disabled:opacity-60"
                >
                  Cancelar
                </button>
                {errorId === reservation.id && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {CANCEL_ERROR_MESSAGE}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
