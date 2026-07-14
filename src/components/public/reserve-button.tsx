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
      <span className="inline-block w-fit rounded-full bg-teal/15 px-3 py-1 text-xs font-medium text-teal-dark">
        Reservado
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onReserve}
      className="w-full rounded-lg bg-teal px-4 py-2 text-sm font-block uppercase text-cream transition-opacity hover:opacity-90"
    >
      Reservar
    </button>
  )
}
