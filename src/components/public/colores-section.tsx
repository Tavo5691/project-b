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
 * "Colores" section — sits on `intro-blue` as the design comp specifies,
 * which is what drives the page's blue/cream alternation.
 *
 * Two deliberate deviations from the comp, both contrast-driven. The
 * headline is `teal-dark` rather than `stencil-red`: red on this blue is
 * ~2.1:1 and fails AA even at display sizes, while teal-dark reaches 3.41:1
 * and clears the 3:1 large-text threshold at this size and weight. The body
 * copy sits inside a cream card instead of directly on the blue — small
 * uppercase text has no compliant ink on this background, so it needs a
 * different surface rather than a different color.
 */
export function ColoresSection() {
  return (
    <section className="w-full bg-intro-blue px-6 py-16 sm:px-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <h2 className="font-display text-3xl uppercase text-teal-dark sm:text-5xl">Colores</h2>

        <div className="rounded-2xl bg-cream px-5 py-4">
          <p className="border-l-4 border-teal pl-4 text-xs uppercase text-stencil-red">
            Colores de preferencia de los papis por si le quieres regalar alguna ropita (mentira, es
            preferencia de la mami — el papi no tiene ni idea).
          </p>
        </div>

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
