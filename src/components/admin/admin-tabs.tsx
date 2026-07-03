'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SettingsForm } from '@/components/admin/settings-form'
import { CategoriesPanel } from '@/components/admin/categories-panel'
import { GiftsPanel } from '@/components/admin/gifts-panel'
import { ReservationsPanel } from '@/components/admin/reservations-panel'
import type { Category, GiftWithCategory, ReservationWithGift, Settings } from '@/types/database'

interface AdminTabsProps {
  settings: Settings
  categories: Category[]
  gifts: GiftWithCategory[]
  reservations: ReservationWithGift[]
}

const TABS = [
  { id: 'settings', label: 'Configuración' },
  { id: 'categories', label: 'Categorías' },
  { id: 'gifts', label: 'Regalos' },
  { id: 'reservations', label: 'Reservas' },
] as const

type TabId = (typeof TABS)[number]['id']

export function AdminTabs({ settings, categories, gifts, reservations }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('settings')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 border-b border-border" role="tablist">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium',
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-muted'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'settings' && <SettingsForm settings={settings} />}
      {activeTab === 'categories' && <CategoriesPanel categories={categories} />}
      {activeTab === 'gifts' && <GiftsPanel gifts={gifts} categories={categories} />}
      {activeTab === 'reservations' && <ReservationsPanel reservations={reservations} />}
    </div>
  )
}
