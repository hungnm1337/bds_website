import prisma from '@/lib/prisma'
import FormsClient from './FormsClient'

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

      <FormsClient forms={forms} />
    </div>
  )
}
