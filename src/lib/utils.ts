// Class name merger utility
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

const ARS_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/**
 * Formats an integer ARS price for display (e.g. `formatARS(15000)` -> "$15.000").
 * Callers decide whether `0` should be hidden (see `GiftCard`) — this
 * function always formats whatever number it receives.
 */
export function formatARS(price: number): string {
  // Intl's es-AR currency format renders "ARS 15.000"; replace the ISO code
  // with a bare "$" to match the spec's exact expected output.
  return ARS_FORMATTER.format(price).replace('ARS', '$').replace(/\s/g, '')
}

// Cancel code word list — 16 words (16 * 9000 = 144,000 combinations)
const CANCEL_WORDS = [
  'ROSA', 'LUNA', 'SOL', 'MAR', 'BEBE', 'AMOR',
  'NUBE', 'BESO', 'MIEL', 'CUNA', 'ALBA', 'FLOR',
  'RAYO', 'AGUA', 'VELA', 'LAGO',
] as const

/**
 * Generates a human-readable cancel code in WORD-NNNN format (e.g. "ROSA-4821").
 * Generated server-side and passed to the reserve_gift RPC as p_cancel_token.
 * On UNIQUE constraint violation (< 0.001% for < 100 reservations), the caller retries once.
 */
export function generateCancelCode(): string {
  const word = CANCEL_WORDS[Math.floor(Math.random() * CANCEL_WORDS.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${word}-${num}`
}
