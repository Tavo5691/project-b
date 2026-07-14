import { Stardos_Stencil, Anton } from 'next/font/google'

const stardosStencil = Stardos_Stencil({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-stencil',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-block',
})

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${stardosStencil.variable} ${anton.variable}`}>
      {children}
    </div>
  )
}
