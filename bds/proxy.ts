import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const getKey = () => new TextEncoder().encode(process.env.ADMIN_SECRET!)

async function verifyToken(token: string | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] })
    return payload
  } catch {
    return null
  }
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (!path.startsWith('/admin')) return NextResponse.next()

  const isLoginPage = path === '/admin/login'
  const cookie = req.cookies.get('admin_session')?.value
  const session = await verifyToken(cookie)

  // Authenticated user visiting login → redirect to dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  // Unauthenticated user visiting protected route → redirect to login
  if (!isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
