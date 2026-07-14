import Link from 'next/link'
import { CancelForm } from '@/components/public/cancel-form'

export default function CancelarPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 bg-cream p-6">
      <div>
        <h1 className="font-display text-2xl uppercase text-stencil-red sm:text-3xl">
          Cancelar reserva
        </h1>
        <p className="text-sm text-teal-dark">
          Ingresá el código que recibiste al reservar (formato PALABRA-0000).
        </p>
      </div>
      <CancelForm />
      <Link href="/invitacion" className="text-sm text-teal-dark underline">
        ← Volver al inicio
      </Link>
    </main>
  )
}
