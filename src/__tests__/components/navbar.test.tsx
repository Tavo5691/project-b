import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/public/navbar'

const usePathname = vi.fn<() => string>()
vi.mock('next/navigation', () => ({ usePathname: () => usePathname() }))

describe('Navbar', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/invitacion')
  })

  it('renders a link for each public section', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Invitación' })).toHaveAttribute(
      'href',
      '/invitacion'
    )
    expect(screen.getByRole('link', { name: 'Regalos' })).toHaveAttribute('href', '/regalos')
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/cancelar')
  })

  it('marks the link matching the current pathname as current', () => {
    usePathname.mockReturnValue('/regalos')
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Regalos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Invitación' })).not.toHaveAttribute('aria-current')
  })

  it('marks no link as current on a pathname outside the nav', () => {
    usePathname.mockReturnValue('/')
    render(<Navbar />)
    expect(screen.queryByRole('link', { current: 'page' })).not.toBeInTheDocument()
  })

  it('exposes the nav landmark with an accessible name', () => {
    render(<Navbar />)
    expect(screen.getByRole('navigation', { name: /secciones/i })).toBeInTheDocument()
  })
})
