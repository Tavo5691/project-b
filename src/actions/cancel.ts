'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CancelReservationResult } from '@/types/database'

export type CancelResult =
  | { success: true; giftName: string; firstName: string; lastName: string }
  | { success: false; error: 'not_found' | 'invalid_input' | 'db_error' }

/**
 * Cancels a reservation by its `WORD-NNNN` cancel token via the
 * `cancel_reservation` RPC (atomic: frees the gift and deletes the
 * reservation row). Bound as `useActionState(cancelReservation)`.
 */
export async function cancelReservation(
  _prevState: CancelResult | null,
  formData: FormData
): Promise<CancelResult> {
  const rawToken = formData.get('cancel_token')

  if (typeof rawToken !== 'string' || rawToken.trim().length === 0) {
    return { success: false, error: 'invalid_input' }
  }

  const cancelToken = rawToken.trim().toUpperCase()
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('cancel_reservation', {
    p_cancel_token: cancelToken,
  })

  if (error) {
    return { success: false, error: 'db_error' }
  }

  const result = data as CancelReservationResult
  if (!result.success) {
    return { success: false, error: 'not_found' }
  }

  revalidatePath('/')
  return {
    success: true,
    giftName: result.gift_name ?? '',
    firstName: result.first_name ?? '',
    lastName: result.last_name ?? '',
  }
}
