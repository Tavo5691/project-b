'use client'

import { useActionState } from 'react'
import { adminLogin, type AdminLoginState } from '@/actions/admin-auth'

export function LoginForm() {
  const [state, action, isPending] = useActionState<AdminLoginState, FormData>(
    adminLogin,
    null
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--color-text)' }}
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2"
          style={{ borderColor: 'var(--color-border)' }}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
