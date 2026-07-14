import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Settings } from '@/types/database'

export default async function SplashPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single()
  const safeSettings = settings as Settings | null

  return (
    <section className="flex min-h-screen flex-col items-center gap-8 bg-cream px-6 sm:px-12">
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-start gap-8">
          <h1 className="max-w-xs text-left font-bold font-display text-5xl leading-tight text-stencil-red sm:max-w-md sm:text-7xl">
            {safeSettings?.welcome_title || 'Nuestro Proyecto Más Lindo'}
          </h1>

          <Link
            href="/invitacion"
            className="rounded-lg bg-teal px-10 py-4 font-block uppercase text-cream transition-opacity hover:opacity-90"
          >
            Haz click para ingresar
          </Link>
        </div>
      </div>

      <footer className="pb-8 text-lg font-bold uppercase text-stencil-red">
        © 2026 Baby Chuchi Inc. Todos los mimos reservados.
      </footer>
    </section>
  )
}
