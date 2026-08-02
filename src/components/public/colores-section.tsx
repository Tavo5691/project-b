const COLOR_SWATCHES: string[] = [
  '#16324a',
  '#5a5a5a',
  '#1e3a2c',
  '#d99a2b',
  '#a13a1a',
  '#d9c0a3',
  '#eef1f4',
  '#d13c22',
  '#7a6a4a',
]

/**
 * "Colores" section — same stencil-red-on-cream headline treatment as
 * "Baby Shower" (EventInfo), and a wrapped row of color swatches (no
 * per-color labels, just the reference).
 *
 * The background is `cream`, not `intro-blue`: stencil-red on intro-blue
 * lands at ~2.1:1 contrast, which fails WCAG AA badly for this section's
 * small uppercase body copy. On cream it clears AA at ~4.9:1.
 */
export function ColoresSection() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-cream px-6 py-16 sm:px-12">
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <h2 className="font-display text-3xl uppercase text-stencil-red sm:text-5xl">Colores</h2>
        <p className="border-l-4 border-teal pl-4 text-xs uppercase text-stencil-red">
          Colores de preferencia de los papis por si le quieres regalar alguna ropita (mentira, es
          preferencia de la mami — el papi no tiene ni idea).
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          {COLOR_SWATCHES.map((hex) => (
            <div
              key={hex}
              className="h-8 w-8 rounded-full border border-black/10"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
