'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type AdminLoginState =
  | { error: string }
  | { error: null }
  | null

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = formData.get('password')

  if (typeof password !== 'string' || password.length === 0) {
    return { error: 'Contraseña incorrecta' }
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Contraseña incorrecta' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })

  redirect('/admin')
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
