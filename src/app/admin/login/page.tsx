import { LoginForm } from '@/components/admin/login-form'

export const metadata = {
  title: 'Admin — Iniciar sesión',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-card-bg)' }}>
      <div
        className="w-full max-w-sm rounded-lg p-8 shadow-sm"
        style={{ backgroundColor: '#ffffff', borderColor: 'var(--color-border)', border: '1px solid' }}
      >
        <h1
          className="text-xl font-normal mb-6 text-center"
          style={{ color: 'var(--color-primary)' }}
        >
          Panel de administración
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}
