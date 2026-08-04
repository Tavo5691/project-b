'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { href: '/invitacion', label: 'Invitación' },
  { href: '/regalos', label: 'Regalos' },
  { href: '/cancelar', label: 'Cancelar' },
] as const

/**
 * Sticky section nav for the `(site)` route group. The splash page at `/`
 * deliberately renders outside that group so it stays chromeless — the
 * "click to enter" gate is the whole point of that screen.
 *
 * Labels are written in sentence case and uppercased with CSS: the design
 * calls for all-caps, but hardcoding caps would make the accessible name
 * all-caps too, which screen readers may spell out letter by letter.
 *
 * The inactive color is `text-muted` (#5a6657, 6.05:1 on white) rather than
 * the design's #999 — at this type size #999 lands at 2.85:1 and fails
 * WCAG AA outright.
 */
export function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Secciones"
      className="sticky top-0 z-40 w-full border-b border-border bg-white"
    >
      <ul className="mx-auto flex w-full max-w-3xl items-stretch sm:justify-center sm:gap-4">
        {SECTIONS.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <li key={href} className="flex-1 sm:flex-none">
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block px-1 py-4 text-center font-block text-[10px] uppercase tracking-wide transition-colors sm:px-6 sm:text-xs',
                  isActive ? 'text-teal-dark' : 'text-text-muted hover:text-teal-dark'
                )}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
