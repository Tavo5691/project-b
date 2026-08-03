// TEMPORARY — preview: the intro split she approved, followed by the current
// production sections expanded to fill one screen each (no rearranging).
// Delete `src/app/(public)/(site)/preview/` once decided.
import { createClient } from '@/lib/supabase/server'
import { ColoresFullScreen, EventInfoFullScreen } from './full-screen-sections'
import { IntroSplit } from './intro-split'
import { LabFullScreen } from './lab-full-screen'
import type { Settings } from '@/types/database'

export default async function PreviewPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single()
  const safeSettings = settings as Settings | null

  return (
    <>
      {safeSettings && <IntroSplit settings={safeSettings} />}
      {safeSettings && <EventInfoFullScreen settings={safeSettings} />}
      <ColoresFullScreen />
      <LabFullScreen />

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 w-[min(92vw,40rem)] -translate-x-1/2 rounded-2xl border border-teal/30 bg-white/95 px-5 py-3 text-center shadow-lg">
        <p className="font-block text-sm uppercase text-teal-dark">
          Intro dividida + secciones a pantalla completa
        </p>
        <p className="text-xs text-text-muted">
          El intro queda como lo aprobaste. Las demás secciones son las actuales, sin cambiar nada
          de lugar, sólo ocupando una pantalla cada una. En celular no cambia nada.
        </p>
      </div>
    </>
  )
}
