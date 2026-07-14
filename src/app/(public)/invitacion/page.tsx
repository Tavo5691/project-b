import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EventInfo } from '@/components/public/event-info'
import { IntroSection } from '@/components/public/intro-section'
import { PhotoGallery } from '@/components/public/photo-gallery'
import type { Settings } from '@/types/database'

export default async function Home() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single()
  const safeSettings = settings as Settings | null

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 bg-cream p-6">
      {safeSettings && <IntroSection settings={safeSettings} />}
      {safeSettings && <EventInfo settings={safeSettings} />}
      {/* `?? []` guards against the `gallery_urls` migration not being
          applied yet on a given environment's DB row (see migration
          005_gift_price_and_gallery.sql) — same defensive-cast pattern used
          for `categories`/`gifts` elsewhere in this codebase. */}
      {safeSettings && <PhotoGallery urls={safeSettings.gallery_urls ?? []} />}

      <footer className="text-center">
        <Link href="/cancelar" className="text-sm text-teal-dark underline">
          ¿Ya reservaste y necesitás cancelar?
        </Link>
      </footer>
    </main>
  )
}
