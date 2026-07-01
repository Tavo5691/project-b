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
  first_name: z.string().min(1, { error: 'El nombre es obligatorio' }),
  last_name: z.string().min(1, { error: 'El apellido es obligatorio' }),
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
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    message: formData.get('message') || undefined,
  })

  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  const { gift_id, first_name, last_name, message } = parsed.data
  const supabase = await createClient()

  let cancelToken = generateCancelCode()

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const { data, error } = await supabase.rpc('reserve_gift', {
      p_gift_id: gift_id,
      p_first_name: first_name,
      p_last_name: last_name,
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
