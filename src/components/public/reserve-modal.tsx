'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { reserveGift, type ReserveResult } from '@/actions/reserve'

interface ReserveModalProps {
  giftId: string
  giftName: string
  onClose: () => void
}

type ModalView = 'form' | 'thanks' | 'race-error'

function resolveView(state: ReserveResult | null): ModalView {
  if (state?.success) return 'thanks'
  if (state && !state.success && state.error === 'already_reserved') return 'race-error'
  return 'form'
}

export function ReserveModal({ giftId, giftName, onClose }: ReserveModalProps) {
  const [state, action, isPending] = useActionState<ReserveResult | null, FormData>(
    reserveGift,
    null
  )
  const [copied, setCopied] = useState(false)
  const view = resolveView(state)

  const inlineError =
    state && !state.success && state.error !== 'already_reserved'
      ? state.error === 'invalid_input'
        ? 'Completá tu nombre y apellido para reservar.'
        : 'Ocurrió un error al reservar. Intentá de nuevo.'
      : null

  async function handleCopy(cancelToken: string) {
    await navigator.clipboard.writeText(cancelToken)
    setCopied(true)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {view === 'form' && (
          <form action={action} className="flex flex-col gap-4">
            <input type="hidden" name="gift_id" value={giftId} />
            <h2 className="text-lg font-semibold text-text">Reservar &quot;{giftName}&quot;</h2>

            <div>
              <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-text">
                Nombre
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-text">
                Apellido
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-text">
                Mensaje (opcional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={2}
                className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>

            {inlineError && (
              <p className="text-sm text-red-600" role="alert">
                {inlineError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded border border-border px-4 py-2 text-sm font-medium text-text-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
              >
                {isPending ? 'Reservando…' : 'Confirmar reserva'}
              </button>
            </div>
          </form>
        )}

        {view === 'thanks' && state?.success && (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-lg font-semibold text-text">¡Gracias por tu reserva!</h2>
            <p className="text-sm text-text-muted">
              Guardá este código: lo vas a necesitar si querés cancelar la reserva.
            </p>
            <p className="rounded bg-card-bg px-4 py-3 font-mono text-xl tracking-wider text-primary">
              {state.cancelToken}
            </p>
            <button
              type="button"
              onClick={() => handleCopy(state.cancelToken)}
              className="rounded border border-border px-4 py-2 text-sm font-medium text-text"
            >
              {copied ? 'Copiado ✓' : 'Copiar código'}
            </button>
            <Link href="/cancelar" className="text-sm text-primary underline">
              ¿Necesitás cancelar? Andá a /cancelar
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Cerrar
            </button>
          </div>
        )}

        {view === 'race-error' && (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-lg font-semibold text-text">Ups, alguien llegó primero</h2>
            <p className="text-sm text-text-muted">
              Este regalo se acaba de reservar. Elegí otro de la lista.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
