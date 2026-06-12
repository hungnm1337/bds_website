'use server'

import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export type LoginState = { error: string } | null

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' }
  }

  await createSession(username)
  redirect('/admin')
}
