'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import type { CancelReservationAdminResult } from '@/types/database'

export type AdminCancelResult =
  | { success: true }
  | { success: false; error: 'not_found' | 'db_error' }

/**
 * Admin-triggered manual cancellation via the `cancel_reservation_admin`
 * RPC (frees the gift and deletes the reservation row). Revalidates both
 * `/admin` (Reservations tab table) and `/` (gift returns to available).
 */
export async function adminCancelReservation(reservationId: string): Promise<AdminCancelResult> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.rpc('cancel_reservation_admin', {
    p_reservation_id: reservationId,
  })

  if (error) {
    return { success: false, error: 'db_error' }
  }

  const result = data as CancelReservationAdminResult
  if (!result.success) {
    return { success: false, error: 'not_found' }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}
