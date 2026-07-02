'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import {
  createCategory,
  renameCategory,
  deleteCategory,
  type CategoryResult,
} from '@/actions/admin/categories'
import type { Category } from '@/types/database'

interface CategoriesPanelProps {
  categories: Category[]
}

const HAS_GIFTS_MESSAGE = 'No se puede eliminar: hay regalos asignados a esta categoría.'
const DELETE_ERROR_MESSAGE = 'No pudimos eliminar la categoría. Intentá de nuevo.'

function AddCategoryForm() {
  const [state, action, isPending] = useActionState<CategoryResult | null, FormData>(
    createCategory,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="flex items-end gap-2">
      <div className="flex-1">
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-text">
          Nueva categoría
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isPending ? 'Agregando…' : 'Agregar'}
      </button>
      {state && !state.success && (
        <p className="text-sm text-red-600" role="alert">
          Ingresá un nombre válido.
        </p>
      )}
    </form>
  )
}

interface CategoryRowProps {
  category: Category
  onDeleted: (categoryId: string) => void
}

function CategoryRow({ category, onDeleted }: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [renameState, renameAction, isRenaming] = useActionState<
    CategoryResult | null,
    FormData
  >(renameCategory, null)

  // Close the inline edit form once the rename succeeds. Adjusted during
  // render (not in an effect) by comparing against the previous action
  // state, per React's "storing info from previous renders" pattern —
  // avoids the cascading-render lint violation from setState-in-effect.
  const [prevRenameState, setPrevRenameState] = useState(renameState)
  if (renameState !== prevRenameState) {
    setPrevRenameState(renameState)
    if (renameState?.success) {
      setIsEditing(false)
    }
  }

  function handleDelete() {
    setDeleteError(null)
    startDeleteTransition(async () => {
      const result = await deleteCategory(category.id)
      if (!result.success) {
        setDeleteError(result.error === 'has_gifts' ? HAS_GIFTS_MESSAGE : DELETE_ERROR_MESSAGE)
        return
      }
      onDeleted(category.id)
    })
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-1">
        <form action={renameAction} className="flex items-center gap-2">
          <input type="hidden" name="category_id" value={category.id} />
          <input
            type="text"
            name="name"
            defaultValue={category.name}
            className="flex-1 rounded border border-border px-3 py-1.5 text-sm outline-none focus:ring-2"
          />
          <button
            type="submit"
            disabled={isRenaming}
            className="rounded border border-border px-3 py-1.5 text-sm font-medium text-text disabled:opacity-60"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded px-3 py-1.5 text-sm text-text-muted"
          >
            Cancelar
          </button>
        </form>
      </li>
    )
  }

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-text">{category.name}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded border border-border px-3 py-1 text-xs font-medium text-text"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      </div>
      {deleteError && (
        <p className="text-xs text-red-600" role="alert">
          {deleteError}
        </p>
      )}
    </li>
  )
}

export function CategoriesPanel({ categories: initialCategories }: CategoriesPanelProps) {
  const [categories, setCategories] = useState(initialCategories)

  function handleDeleted(categoryId: string) {
    setCategories((current) => current.filter((category) => category.id !== categoryId))
  }

  return (
    <div className="flex flex-col gap-6">
      <AddCategoryForm />
      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} onDeleted={handleDeleted} />
        ))}
      </ul>
    </div>
  )
}
