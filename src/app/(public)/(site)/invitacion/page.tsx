import { createClient } from '@/lib/supabase/server'
import { BabyChuchiLab } from '@/components/public/baby-chuchi-lab'
import { ColoresSection } from '@/components/public/colores-section'
import { EventInfo } from '@/components/public/event-info'
import { IntroSection } from '@/components/public/intro-section'
import type { Settings } from '@/types/database'

export default async function Home() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single()
  const safeSettings = settings as Settings | null

  return (
    <>
      {safeSettings && <IntroSection settings={safeSettings} />}
      {safeSettings && <EventInfo settings={safeSettings} />}
      <ColoresSection />
      <BabyChuchiLab />
    </>
  )
}
