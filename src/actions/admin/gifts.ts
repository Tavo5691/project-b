'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

const giftSchema = z.object({
  category_id: z.string().min(1, { error: 'Elegí una categoría' }),
  name: z.string().min(1, { error: 'El nombre es obligatorio' }),
  description: z.string().optional(),
  image_url: z.string().optional(),
  external_link: z.string().optional(),
  price: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce.number().int().min(0, { error: 'El precio debe ser 0 o mayor' })
  ),
})

export type GiftResult = { success: true } | { success: false; error: 'invalid_input' | 'db_error' }

function parseGiftFields(formData: FormData) {
  return giftSchema.safeParse({
    category_id: formData.get('category_id'),
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    image_url: formData.get('image_url') ?? '',
    external_link: formData.get('external_link') ?? '',
    price: formData.get('price'),
  })
}

/**
 * Creates a new gift, always starting as `available`. Gift mutations
 * revalidate both `/admin` (dashboard) and `/regalos` (public gift grid —
 * gift data no longer renders on `/` since the landing/registry split).
 */
export async function createGift(
  _prevState: GiftResult | null,
  formData: FormData
): Promise<GiftResult> {
  const parsed = parseGiftFields(formData)
  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  const supabase = await createAdminClient()
  const { error } = await supabase.from('gifts').insert({
    category_id: parsed.data.category_id,
    name: parsed.data.name,
    description: parsed.data.description ?? '',
    image_url: parsed.data.image_url ?? '',
    external_link: parsed.data.external_link ?? '',
    status: 'available',
    price: parsed.data.price,
  })

  if (error) {
    return { success: false, error: 'db_error' }
  }

  revalidatePath('/admin')
  revalidatePath('/regalos')
  return { success: true }
}

export async function updateGift(
  _prevState: GiftResult | null,
  formData: FormData
): Promise<GiftResult> {
  const giftId = formData.get('gift_id')
  const parsed = parseGiftFields(formData)

  if (typeof giftId !== 'string' || giftId.length === 0 || !parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('gifts')
    .update({
      category_id: parsed.data.category_id,
      name: parsed.data.name,
      description: parsed.data.description ?? '',
      image_url: parsed.data.image_url ?? '',
      external_link: parsed.data.external_link ?? '',
      price: parsed.data.price,
    })
    .eq('id', giftId)

  if (error) {
    return { success: false, error: 'db_error' }
  }

  revalidatePath('/admin')
  revalidatePath('/regalos')
  return { success: true }
}

export async function deleteGift(giftId: string): Promise<GiftResult> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('gifts').delete().eq('id', giftId)

  if (error) {
    return { success: false, error: 'db_error' }
  }

  revalidatePath('/admin')
  revalidatePath('/regalos')
  return { success: true }
}
