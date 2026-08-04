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
          <label htmlFor="cancel_token" className="mb-1 block text-sm font-medium text-teal-dark">
            Código de cancelación
          </label>
          <input
            id="cancel_token"
            name="cancel_token"
            type="text"
            required
            placeholder="ROSA-4821"
            aria-describedby="cancel_token_hint"
            className="w-full rounded-lg border border-teal/30 bg-white px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-teal"
          />
          {/* Wired through `aria-describedby` rather than left as loose text:
              the format is the difference between a successful lookup and a
              silent "not found", so it has to reach screen readers too. */}
          <p id="cancel_token_hint" className="mt-1 text-xs text-text-muted">
            Es el código que recibiste al reservar, con formato PALABRA-0000.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-teal px-4 py-2 text-sm font-block uppercase text-cream transition-opacity disabled:opacity-60 hover:opacity-90"
        >
          {isPending ? 'Cancelando…' : 'Confirmar cancelación'}
        </button>
      </form>

      {state?.success && (
        <p className="rounded-lg bg-white p-4 text-sm text-text" role="status">
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
