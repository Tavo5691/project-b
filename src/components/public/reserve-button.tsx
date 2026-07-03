'use client'

interface ReserveButtonProps {
  isReserved: boolean
  onReserve: () => void
}

/**
 * Purely presentational — the reservation modal itself is owned by
 * `CategoryTabs` and rendered as its sibling, not nested here. Nesting it
 * inside this button (or inside `GiftCard`) means it gets unmounted the
 * instant `reserveGift`'s `revalidatePath('/')` causes an ancestor to
 * conditionally swap this subtree away (e.g. `CategoryTabs` replacing its
 * grid with the "all reserved" message once the last gift in the active
 * category flips status) — closing the modal before the guest ever sees
 * the thanks screen with their cancel code.
 */
export function ReserveButton({ isReserved, onReserve }: ReserveButtonProps) {
  if (isReserved) {
    return (
      <span className="inline-block w-fit rounded bg-border px-3 py-1 text-xs font-medium text-text-muted">
        Reservado
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onReserve}
      className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      Reservar
    </button>
  )
}
