import { createClient } from '@/lib/supabase/server'
import { EventInfo } from '@/components/public/event-info'
import { BankSection } from '@/components/public/bank-section'
import { CategoryTabs } from '@/components/public/category-tabs'
import type { Category, GiftWithCategory, Settings } from '@/types/database'

export default async function Home() {
  const supabase = await createClient()

  const [{ data: settings }, { data: categories }, { data: gifts }] = await Promise.all([
    supabase.from('settings').select('*').eq('id', 1).single(),
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase
      .from('gifts')
      .select('*, category:categories(id, name, created_at)')
      .order('name', { ascending: true }),
  ])

  const safeSettings = settings as Settings | null
  const safeCategories = (categories ?? []) as Category[]
  const safeGifts = (gifts ?? []) as unknown as GiftWithCategory[]

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      {safeSettings && <EventInfo settings={safeSettings} />}
      <CategoryTabs categories={safeCategories} gifts={safeGifts} />
      {safeSettings && <BankSection settings={safeSettings} />}
    </main>
  )
}
