import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { adminLogout } from '@/actions/admin-auth'
import { AdminTabs } from '@/components/admin/admin-tabs'
import type {
  Category,
  GiftWithCategory,
  ReservationWithGift,
  Settings,
} from '@/types/database'

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  welcome_title: '',
  welcome_subtitle: '',
  intro_message: '',
  event_date: '',
  event_time: '',
  event_address: '',
  maps_url: '',
  cash_note: '',
  bank_name: '',
  bank_account: '',
  bank_holder: '',
  gallery_urls: [],
}

export default async function AdminPage() {
  const supabase = await createAdminClient()

  const [{ data: settings }, { data: categories }, { data: gifts }, { data: reservations }] =
    await Promise.all([
      supabase.from('settings').select('*').eq('id', 1).single(),
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase
        .from('gifts')
        .select('*, category:categories(id, name, created_at)')
        .order('name', { ascending: true }),
      supabase
        .from('reservations')
        .select('*, gift:gifts(*)')
        .order('created_at', { ascending: false }),
    ])

  const safeSettings = (settings as Settings | null) ?? DEFAULT_SETTINGS
  const safeCategories = (categories ?? []) as Category[]
  const safeGifts = (gifts ?? []) as unknown as GiftWithCategory[]
  const safeReservations = (reservations ?? []) as unknown as ReservationWithGift[]

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Panel de administración</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-primary underline">
            Ver sitio público
          </Link>
          <form action={adminLogout}>
            <button type="submit" className="text-sm text-text-muted underline">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
      <AdminTabs
        settings={safeSettings}
        categories={safeCategories}
        gifts={safeGifts}
        reservations={safeReservations}
      />
    </main>
  )
}
