import type { Settings } from '@/types/database'

interface BankSectionProps {
  settings: Settings
}

export function BankSection({ settings }: BankSectionProps) {
  const hasBankInfo = settings.bank_name || settings.bank_account || settings.bank_holder

  if (!hasBankInfo) return null

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-teal/20 bg-white p-6">
      <h2 className="font-block uppercase text-teal-dark">Datos para transferencia</h2>
      <dl className="flex flex-col gap-1 text-sm text-text">
        {settings.bank_name && (
          <div className="flex gap-2">
            <dt className="font-medium">Banco:</dt>
            <dd>{settings.bank_name}</dd>
          </div>
        )}
        {settings.bank_account && (
          <div className="flex gap-2">
            <dt className="font-medium">Cuenta / Alias:</dt>
            <dd>{settings.bank_account}</dd>
          </div>
        )}
        {settings.bank_holder && (
          <div className="flex gap-2">
            <dt className="font-medium">Titular:</dt>
            <dd>{settings.bank_holder}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
