import Link from 'next/link'
import { CancelForm } from '@/components/public/cancel-form'

export default function CancelarPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Cancelar reserva</h1>
        <p className="text-sm text-text-muted">
          Ingresá el código que recibiste al reservar (formato PALABRA-0000).
        </p>
      </div>
      <CancelForm />
      <Link href="/" className="text-sm text-primary underline">
        ← Volver al inicio
      </Link>
    </main>
  )
}
