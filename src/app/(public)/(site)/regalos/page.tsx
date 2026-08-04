import { createClient } from '@/lib/supabase/server'
import { CategoryTabs } from '@/components/public/category-tabs'
import type { Category, GiftWithCategory } from '@/types/database'

export default async function RegalosPage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: gifts }] = await Promise.all([
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase
      .from('gifts')
      .select('*, category:categories(id, name, created_at)')
      .order('name', { ascending: true }),
  ])

  const safeCategories = (categories ?? []) as Category[]
  const safeGifts = (gifts ?? []) as unknown as GiftWithCategory[]

  // The column is `max-w-5xl` rather than the `max-w-3xl` used by the
  // invitation's prose sections: the gift grid reaches four columns at `lg`,
  // which needs the wider measure to keep each card readable. Same
  // two-measure rule as `IntroSection` — prose gets 3xl, grid/media gets 5xl.
  return (
    <main className="w-full bg-cream px-6 py-10 sm:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <CategoryTabs categories={safeCategories} gifts={safeGifts} />
      </div>
    </main>
  )
}
