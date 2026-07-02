'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GiftCard } from '@/components/public/gift-card'
import { ReserveModal } from '@/components/public/reserve-modal'
import type { Category, GiftWithCategory } from '@/types/database'

interface CategoryTabsProps {
  categories: Category[]
  gifts: GiftWithCategory[]
}

const EMPTY_CATEGORY_MESSAGE =
  'Todos los regalos de esta categoría ya están reservados. ¡Gracias por su generosidad!'

export function CategoryTabs({ categories, gifts }: CategoryTabsProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(categories[0]?.id)
  const [reservingGift, setReservingGift] = useState<{ id: string; name: string } | null>(null)

  const filteredGifts = gifts.filter((gift) => gift.category_id === activeCategoryId)
  // Vacuously true for an empty category, so "no gifts assigned yet" and
  // "every gift already reserved" both trigger the same empty-state message.
  const allReserved = filteredGifts.every((gift) => gift.status === 'reserved')

  return (
    <div className="flex flex-col gap-4">
      <div className="category-tabs" role="tablist">
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategoryId(category.id)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-text-muted'
              )}
            >
              {category.name}
            </button>
          )
        })}
      </div>

      {allReserved ? (
        <p className="rounded-lg bg-card-bg p-6 text-center text-sm text-text-muted">
          {EMPTY_CATEGORY_MESSAGE}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {filteredGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onReserve={setReservingGift} />
          ))}
        </div>
      )}

      {reservingGift && (
        <ReserveModal
          giftId={reservingGift.id}
          giftName={reservingGift.name}
          onClose={() => setReservingGift(null)}
        />
      )}
    </div>
  )
}
