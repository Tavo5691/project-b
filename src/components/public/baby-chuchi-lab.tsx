'use client'

import { useSyncExternalStore } from 'react'

// UTC-anchored on purpose: `new Date(2026, 1, 9)` would resolve against the
// running process's timezone, so the server (UTC) and the browser (UTC-3)
// would disagree near a week boundary.
const LMP_UTC = Date.UTC(2026, 1, 9) // último período: 9 de febrero 2026
const FULL_TERM_WEEKS = 40

function gestationWeeks() {
  const days = Math.floor((Date.now() - LMP_UTC) / 86400000)
  return Math.max(0, Math.floor(days / 7))
}

const LAB_FACTS = [
  { week: 8, icon: '♥', text: 'Ya tiene latido de corazón' },
  { week: 12, icon: '✋', text: 'Mueve manitos y piecitos' },
  { week: 16, icon: '👍', text: 'Puede chuparse el dedito' },
  { week: 18, icon: '♪', text: 'Ya escucha cuando le cantamos' },
  { week: 21, icon: '☺', text: 'Reconoce sabores' },
  { week: 24, icon: '👣', text: 'Sus huellitas ya están formadas' },
  { week: 27, icon: '👀', text: 'Abre y cierra los ojitos' },
  { week: 30, icon: '☀', text: 'Distingue luz y oscuridad' },
  { week: 34, icon: '💤', text: 'Ya sueña (fases de sueño REM)' },
  { week: 37, icon: '🍼', text: 'Ya está listo para nacer' },
]

/** Re-read the clock hourly so the bar advances without a page reload. */
function subscribe(onStoreChange: () => void) {
  const id = setInterval(onStoreChange, 3600000)
  return () => clearInterval(id)
}

/**
 * "Baby Chuchi Lab" section — gestation-week progress bar calculated from
 * the last-menstrual-period date (refreshed hourly) and a list of milestones
 * that reveals more items as gestation weeks pass.
 *
 * The week is read through `useSyncExternalStore` rather than initialized in
 * `useState`: this is a Client Component rendered from a Server Component, so
 * a value derived from `Date.now()` during render would be baked in at SSR
 * time and could disagree with the browser's own calculation at hydration —
 * a mismatch that changes the *number of rendered facts*, not just their
 * text. The `null` server snapshot makes the server output stable by
 * construction, and the client swaps in the real week right after hydration.
 */
export function BabyChuchiLab() {
  const week = useSyncExternalStore<number | null>(subscribe, gestationWeeks, () => null)

  const progress = week === null ? 0 : Math.min(100, (week / FULL_TERM_WEEKS) * 100)
  const visibleFacts = week === null ? [] : LAB_FACTS.filter((f) => f.week <= week)

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-cream px-6 py-16 sm:px-12">
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <h2 className="font-display text-3xl uppercase text-stencil-red sm:text-5xl">
          Baby Chuchi Lab
        </h2>
        <p className="border-l-4 border-teal pl-4 text-xs uppercase text-stencil-red">
          Aunque compartimos carga genética, Benja tendrá una combinación genética única que nunca
          existió antes ni volverá a existir.
        </p>

        <div className="text-center font-display text-sm uppercase tracking-wide text-stencil-red">
          {week !== null && `${week} semanas`}
        </div>
        <div className="relative h-9 overflow-visible rounded-full bg-stencil-red">
          <div
            data-testid="progress-fill"
            className="absolute inset-y-0 left-0 rounded-l-full bg-[#d99a2b]"
            style={{ width: `${progress}%` }}
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg leading-none"
            style={{ left: `${progress}%` }}
          >
            👣
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {visibleFacts.map((fact) => (
            <div
              key={fact.week}
              className="flex items-center gap-2 rounded-[10px] border border-teal/20 bg-white px-3 py-2"
            >
              <span aria-hidden="true" className="text-sm text-teal">
                {fact.icon}
              </span>
              <span className="text-[10.5px] uppercase text-text-muted">{fact.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
