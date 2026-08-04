'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateCancelCode } from '@/lib/utils'
import type { ReserveGiftResult } from '@/types/database'

const UNIQUE_VIOLATION = '23505'
const MAX_ATTEMPTS = 2

const reserveSchema = z.object({
  gift_id: z.string().min(1, { error: 'Falta el regalo a reservar' }),
  name: z.string().min(1, { error: 'El nombre es obligatorio' }),
  message: z.string().optional(),
})

export type ReserveResult =
  | { success: true; cancelToken: string }
  | { success: false; error: 'already_reserved' | 'invalid_input' | 'db_error' }

/**
 * Reserves a gift atomically via the `reserve_gift` RPC.
 * Bound as a React 19 form action through `useActionState(reserveGift)`;
 * `gift_id` travels as a hidden form field so the signature stays
 * `(prevState, formData)` as required by `useActionState`.
 */
export async function reserveGift(
  _prevState: ReserveResult | null,
  formData: FormData
): Promise<ReserveResult> {
  const parsed = reserveSchema.safeParse({
    gift_id: formData.get('gift_id'),
    name: formData.get('name'),
    message: formData.get('message') || undefined,
  })

  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  const { gift_id, name, message } = parsed.data
  const supabase = await createClient()

  let cancelToken = generateCancelCode()

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const { data, error } = await supabase.rpc('reserve_gift', {
      p_gift_id: gift_id,
      // The `reservations` table still has a NOT NULL last_name column —
      // the form was collapsed to a single name field, and dropping the
      // column is a migration judged out of scope. Same posture as the
      // unused `settings` columns.
      p_first_name: name,
      p_last_name: '',
      p_message: message ?? null,
      p_cancel_token: cancelToken,
    })

    if (error) {
      const isUniqueViolation = error.code === UNIQUE_VIOLATION
      const canRetry = isUniqueViolation && attempt < MAX_ATTEMPTS - 1
      if (canRetry) {
        cancelToken = generateCancelCode()
        continue
      }
      return { success: false, error: 'db_error' }
    }

    const result = data as ReserveGiftResult
    if (!result.success) {
      return { success: false, error: 'already_reserved' }
    }

    revalidatePath('/')
    return { success: true, cancelToken: result.cancel_token ?? cancelToken }
  }

  return { success: false, error: 'db_error' }
}
