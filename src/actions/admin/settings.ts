'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

const settingsSchema = z.object({
  welcome_title: z.string().min(1, { error: 'El título es obligatorio' }),
  welcome_subtitle: z.string().optional(),
  event_date: z.string().optional(),
  event_time: z.string().optional(),
  event_address: z.string().optional(),
  maps_url: z.string().optional(),
  cash_note: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account: z.string().optional(),
  bank_holder: z.string().optional(),
  gallery_urls: z.array(z.url({ error: 'URL inválida' })).default([]),
})

export type SettingsResult = { success: true } | { success: false; error: string }

/**
 * Upserts the single `settings` row (id=1). Bound as
 * `useActionState(updateSettings)` from the admin Settings tab form.
 */
export async function updateSettings(
  _prevState: SettingsResult | null,
  formData: FormData
): Promise<SettingsResult> {
  const parsed = settingsSchema.safeParse({
    welcome_title: formData.get('welcome_title'),
    welcome_subtitle: formData.get('welcome_subtitle') ?? '',
    event_date: formData.get('event_date') ?? '',
    event_time: formData.get('event_time') ?? '',
    event_address: formData.get('event_address') ?? '',
    maps_url: formData.get('maps_url') ?? '',
    cash_note: formData.get('cash_note') ?? '',
    bank_name: formData.get('bank_name') ?? '',
    bank_account: formData.get('bank_account') ?? '',
    bank_holder: formData.get('bank_holder') ?? '',
    gallery_urls: formData.getAll('gallery_url'),
  })

  if (!parsed.success) {
    return { success: false, error: 'Revisá los campos del formulario.' }
  }

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...parsed.data }, { onConflict: 'id' })

  if (error) {
    return { success: false, error: 'No pudimos guardar los cambios.' }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}
