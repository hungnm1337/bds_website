'use client'

import { useTransition } from 'react'
import { markFormRead, deleteForm } from '@/app/admin/actions/form'

export default function FormActions({ id, isRead }: { id: number; isRead: boolean }) {
  const [isPendingRead, startRead] = useTransition()
  const [isPendingDelete, startDelete] = useTransition()

  return (
    <div className="flex items-center justify-end gap-2">
      {!isRead && (
        <button
          onClick={() => startRead(() => markFormRead(id))}
          disabled={isPendingRead}
          className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingRead ? '...' : 'Đánh dấu đọc'}
        </button>
      )}
      <button
        onClick={() => {
          if (confirm('Xoá form này?')) startDelete(() => deleteForm(id))
        }}
        disabled={isPendingDelete}
        className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPendingDelete ? '...' : 'Xoá'}
      </button>
    </div>
  )
}
