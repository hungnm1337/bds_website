import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const [totalForms, unreadForms, totalProjects, totalImages] = await Promise.all([
    prisma.contact_form.count(),
    prisma.contact_form.count({ where: { is_read: false } }),
    prisma.project.count(),
    prisma.project_image.count(),
  ])

  const recentForms = await prisma.contact_form.findMany({
    orderBy: { created_at: 'desc' },
    take: 5,
  })

  const recentProjects = await prisma.project.findMany({
    orderBy: { id: 'desc' },
    take: 4,
  })

  const stats = [
    {
      label: 'Tổng form',
      value: totalForms,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: '#3b82f6',
      bg: '#EFF6FF',
    },
    {
      label: 'Chưa đọc',
      value: unreadForms,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: '#f59e0b',
      bg: '#FFFBEB',
    },
    {
      label: 'Dự án',
      value: totalProjects,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: '#10b981',
      bg: '#ECFDF5',
    },
    {
      label: 'Hình ảnh',
      value: totalImages,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: '#8b5cf6',
      bg: '#F5F3FF',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-500 text-sm mt-1">Xin chào Admin! Đây là tóm tắt hệ thống hôm nay.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Forms */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Form liên hệ gần đây</h2>
            <Link href="/admin/forms" className="text-xs font-medium text-blue-600 hover:text-blue-800">
              Xem tất cả →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentForms.length === 0 && (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">Chưa có form nào</p>
            )}
            {recentForms.map((form) => (
              <div key={form.id} className="px-6 py-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#0F4C81,#1e6fb5)' }}>
                  {form.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{form.full_name}</p>
                    {!form.is_read && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{form.phone_number}</p>
                </div>
                <p className="text-xs text-gray-400 shrink-0">
                  {form.created_at?.toLocaleDateString('vi-VN')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Dự án mới nhất</h2>
            <Link href="/admin/projects" className="text-xs font-medium text-blue-600 hover:text-blue-800">
              Xem tất cả →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProjects.length === 0 && (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">Chưa có dự án nào</p>
            )}
            {recentProjects.map((project) => (
              <div key={project.id} className="px-6 py-4 flex items-center gap-3">
                {project.main_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.main_image_url} alt={project.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                  <p className="text-xs text-gray-500 truncate">{project.address}</p>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg shrink-0">
                  {project.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
