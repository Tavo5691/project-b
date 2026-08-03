import { CancelForm } from '@/components/public/cancel-form'

export default function CancelarPage() {
  // `flex-1` claims whatever height the nav left over (see the `(site)`
  // layout's flex column), so this short form centers in the viewport
  // instead of clinging to the top of a mostly empty page.
  return (
    <main className="flex w-full flex-1 items-center justify-center px-6 py-12 sm:px-12">
      <div className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-teal/20 bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl uppercase text-stencil-red sm:text-3xl">
          Cancelar reserva
        </h1>
        <CancelForm />
      </div>
    </main>
  )
}
