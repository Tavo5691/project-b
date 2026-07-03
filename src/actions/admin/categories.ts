'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

const FOREIGN_KEY_VIOLATION = '23503'

const nameSchema = z.string().min(1, { error: 'El nombre es obligatorio' })

export type CategoryResult =
  | { success: true }
  | { success: false; error: 'invalid_input' | 'has_gifts' | 'db_error' }

export async function createCategory(
  _prevState: CategoryResult | null,
  formData: FormData
): Promise<CategoryResult> {
  const parsed = nameSchema.safeParse(formData.get('name'))
  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  const supabase = await createAdminClient()
  const { error } = await supabase.from('categories').insert({ name: parsed.data })

  if (error) {
    return { success: false, error: 'db_error' }
  }

  revalidatePath('/admin')
  return { success: true }
}

/**
 * Renames an existing category. Not part of the original design's
 * Interfaces list (only createCategory/deleteCategory were specified),
 * but required by the admin-dashboard spec's Categories Tab requirement
 * ("MUST support: add new, rename existing, delete").
 */
export async function renameCategory(
  _prevState: CategoryResult | null,
  formData: FormData
): Promise<CategoryResult> {
  const categoryId = formData.get('category_id')
  const parsed = nameSchema.safeParse(formData.get('name'))

  if (typeof categoryId !== 'string' || categoryId.length === 0 || !parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('categories')
    .update({ name: parsed.data })
    .eq('id', categoryId)

  if (error) {
    return { success: false, error: 'db_error' }
  }

  revalidatePath('/admin')
  return { success: true }
}

/**
 * Deletes a category. `gifts.category_id` has `ON DELETE RESTRICT`, so
 * Postgres raises a foreign_key_violation (23503) when gifts still
 * reference the category — surfaced to the caller as `has_gifts`.
 */
export async function deleteCategory(categoryId: string): Promise<CategoryResult> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)

  if (error) {
    if (error.code === FOREIGN_KEY_VIOLATION) {
      return { success: false, error: 'has_gifts' }
    }
    return { success: false, error: 'db_error' }
  }

  revalidatePath('/admin')
  return { success: true }
}
