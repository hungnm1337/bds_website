import AdminSidebar from '@/app/admin/components/AdminSidebar'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  const session = await decrypt(token)
  const isAuthenticated = !!session

  // Login page: no sidebar
  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F1F5F9' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
