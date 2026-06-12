import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const getKey = () => new TextEncoder().encode(process.env.ADMIN_SECRET!)

export async function encrypt(payload: { username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey())
}

export async function decrypt(session: string | undefined = '') {
  try {
    if (!session) return null
    const { payload } = await jwtVerify(session, getKey(), { algorithms: ['HS256'] })
    return payload
  } catch {
    return null
  }
}

export async function createSession(username: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ username })
  const cookieStore = await cookies()
  cookieStore.set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

export async function verifySession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('admin_session')?.value
  return await decrypt(cookie)
}
