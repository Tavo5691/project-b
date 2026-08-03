import { Navbar } from '@/components/public/navbar'

/**
 * Wraps the three navigable public sections. The splash page lives one level
 * up in `(public)` so it renders without the nav — keeping the gate intact
 * without a pathname conditional inside `Navbar` itself.
 *
 * `bg-cream` sits here rather than on each page: `body` is white, so any
 * route whose content is shorter than the viewport (or any over-scroll
 * bounce on the tall ones) would otherwise expose a white band below the
 * last section. The flex column lets a short page's `<main>` claim the
 * leftover height with `flex-1` instead of guessing at `100vh` minus the
 * nav.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      {children}
    </div>
  )
}
