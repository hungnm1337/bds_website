'use client'

import { useTransition } from 'react'
import { markFormRead, deleteForm } from '@/app/admin/actions/form'

interface FormActionsProps {
  id: number
  isRead: boolean
  /** Nếu true: chỉ hiện nút "Đánh dấu đọc", ẩn nút xoá (dùng trong modal) */
  onlyMarkRead?: boolean
  /** Callback sau khi thao tác xong (dùng để đóng modal) */
  onDone?: () => void
}

export default function FormActions({ id, isRead, onlyMarkRead = false, onDone }: FormActionsProps) {
  const [isPendingRead, startRead] = useTransition()
  const [isPendingDelete, startDelete] = useTransition()

  return (
    <div className="flex items-center justify-end gap-2">
      {!isRead && (
        <button
          onClick={() =>
            startRead(async () => {
              await markFormRead(id)
              onDone?.()
            })
          }
          disabled={isPendingRead}
          className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingRead ? '...' : 'Đánh dấu đọc'}
        </button>
      )}
      {!onlyMarkRead && (
        <button
          onClick={() => {
            if (confirm('Xoá form này?'))
              startDelete(async () => {
                await deleteForm(id)
                onDone?.()
              })
          }}
          disabled={isPendingDelete}
          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPendingDelete ? '...' : 'Xoá'}
        </button>
      )}
    </div>
  )
}
