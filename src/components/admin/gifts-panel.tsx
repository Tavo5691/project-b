'use client'

import { useState, useTransition } from 'react'
import { deleteGift } from '@/actions/admin/gifts'
import { GiftForm } from '@/components/admin/gift-form'
import { formatARS } from '@/lib/utils'
import type { Category, Gift, GiftWithCategory } from '@/types/database'

interface GiftsPanelProps {
  gifts: GiftWithCategory[]
  categories: Category[]
}

const ALL_CATEGORIES = 'all'

export function GiftsPanel({ gifts: initialGifts, categories }: GiftsPanelProps) {
  const [gifts, setGifts] = useState(initialGifts)
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES)
  const [modalMode, setModalMode] = useState<'closed' | 'create' | 'edit'>('closed')
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, startDeleteTransition] = useTransition()

  const filteredGifts =
    categoryFilter === ALL_CATEGORIES
      ? gifts
      : gifts.filter((gift) => gift.category_id === categoryFilter)

  function openCreateModal() {
    setEditingGift(null)
    setModalMode('create')
  }

  function openEditModal(gift: GiftWithCategory) {
    setEditingGift(gift)
    setModalMode('edit')
  }

  function closeModal() {
    setModalMode('closed')
    setEditingGift(null)
  }

  function handleDelete(giftId: string) {
    setDeletingId(giftId)
    startDeleteTransition(async () => {
      const result = await deleteGift(giftId)
      if (result.success) {
        setGifts((current) => current.filter((gift) => gift.id !== giftId))
      }
      setDeletingId(null)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-text">
            Filtrar por categoría
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2"
          >
            <option value={ALL_CATEGORIES}>Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Agregar regalo
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {filteredGifts.map((gift) => (
          <li
            key={gift.id}
            className="flex items-center justify-between gap-2 rounded border border-border p-3"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text">{gift.name}</span>
              <span className="text-xs text-text-muted">
                {gift.category.name} ·{' '}
                {gift.status === 'reserved' ? 'Reservado' : 'Disponible'}
                {gift.price > 0 && (
                  <>
                    {' '}
                    · <span>{formatARS(gift.price)}</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => openEditModal(gift)}
                className="rounded border border-border px-3 py-1 text-xs font-medium text-text"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(gift.id)}
                disabled={isDeleting && deletingId === gift.id}
                className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 disabled:opacity-60"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalMode !== 'closed' && (
        <GiftForm
          categories={categories}
          gift={editingGift ?? undefined}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
