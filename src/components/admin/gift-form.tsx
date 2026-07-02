'use client'

import { useActionState, useEffect } from 'react'
import { createGift, updateGift, type GiftResult } from '@/actions/admin/gifts'
import type { Category, Gift } from '@/types/database'

interface GiftFormProps {
  categories: Category[]
  gift?: Gift
  onClose: () => void
}

const SAVE_ERROR_MESSAGE = 'No pudimos guardar el regalo.'

export function GiftForm({ categories, gift, onClose }: GiftFormProps) {
  const isEditMode = Boolean(gift)
  const boundAction = isEditMode ? updateGift : createGift
  const [state, action, isPending] = useActionState<GiftResult | null, FormData>(
    boundAction,
    null
  )

  useEffect(() => {
    if (state?.success) {
      onClose()
    }
  }, [state, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <form
        action={action}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-lg"
      >
        {gift && <input type="hidden" name="gift_id" value={gift.id} />}

        <h2 className="text-lg font-semibold text-text">
          {isEditMode ? 'Editar regalo' : 'Nuevo regalo'}
        </h2>

        <div>
          <label htmlFor="category_id" className="mb-1 block text-sm font-medium text-text">
            Categoría
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={gift?.category_id ?? ''}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
          >
            <option value="" disabled>
              Elegí una categoría
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-text">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={gift?.name ?? ''}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-text">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={gift?.description ?? ''}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="image_url" className="mb-1 block text-sm font-medium text-text">
            URL de la imagen
          </label>
          <input
            id="image_url"
            name="image_url"
            type="text"
            defaultValue={gift?.image_url ?? ''}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="external_link" className="mb-1 block text-sm font-medium text-text">
            Link del producto
          </label>
          <input
            id="external_link"
            name="external_link"
            type="text"
            defaultValue={gift?.external_link ?? ''}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        {state && !state.success && (
          <p className="text-sm text-red-600" role="alert">
            {SAVE_ERROR_MESSAGE}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded border border-border px-4 py-2 text-sm font-medium text-text-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
