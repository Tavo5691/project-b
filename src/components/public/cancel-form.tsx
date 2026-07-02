'use client'

import { useActionState } from 'react'
import { cancelReservation, type CancelResult } from '@/actions/cancel'

export function CancelForm() {
  const [state, action, isPending] = useActionState<CancelResult | null, FormData>(
    cancelReservation,
    null
  )

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col gap-4">
        <div>
          <label htmlFor="cancel_token" className="mb-1 block text-sm font-medium text-text">
            Código de cancelación
          </label>
          <input
            id="cancel_token"
            name="cancel_token"
            type="text"
            required
            placeholder="ROSA-4821"
            className="w-full rounded border border-border px-3 py-2 text-sm uppercase outline-none focus:ring-2"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
        >
          {isPending ? 'Cancelando…' : 'Confirmar cancelación'}
        </button>
      </form>

      {state?.success && (
        <p className="rounded bg-card-bg p-4 text-sm text-text" role="status">
          Cancelamos la reserva de <strong>{state.giftName}</strong> a nombre de{' '}
          {state.firstName} {state.lastName}.
        </p>
      )}

      {state && !state.success && state.error === 'not_found' && (
        <p className="text-sm text-red-600" role="alert">
          No encontramos una reserva con ese código.
        </p>
      )}

      {state && !state.success && state.error !== 'not_found' && (
        <p className="text-sm text-red-600" role="alert">
          Ingresá un código válido para cancelar la reserva.
        </p>
      )}
    </div>
  )
}
