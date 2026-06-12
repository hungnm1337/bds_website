import prisma from '@/lib/prisma'
import FormActions from './FormActions'

export default async function AdminFormsPage() {
  const forms = await prisma.contact_form.findMany({
    orderBy: { created_at: 'desc' },
  })

  const unreadCount = forms.filter((f) => !f.is_read).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form liên hệ</h1>
          <p className="text-gray-500 text-sm mt-1">
            {forms.length} form tổng cộng
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {unreadCount} chưa đọc
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {forms.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 font-medium">Chưa có form liên hệ nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nội dung</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày gửi</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {forms.map((form) => (
                  <tr key={form.id} className={`transition-colors hover:bg-gray-50 ${!form.is_read ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: 'linear-gradient(135deg,#0F4C81,#1e6fb5)' }}>
                          {form.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{form.full_name}</p>
                          {!form.is_read && <span className="text-xs text-blue-600 font-medium">Mới</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`tel:${form.phone_number}`} className="text-sm text-blue-600 hover:underline font-medium">
                        {form.phone_number}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {form.message || <span className="text-gray-400 italic">Không có nội dung</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {form.created_at?.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {form.is_read ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                          Đã đọc
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Chưa đọc
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <FormActions id={form.id} isRead={form.is_read ?? false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
