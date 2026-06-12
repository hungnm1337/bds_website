'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProject } from '@/app/admin/actions/project'

export default function ProjectActions({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        if (confirm('Bạn có chắc muốn xoá dự án này?')) {
          startTransition(async () => {
            await deleteProject(id)
            router.refresh()
          })
        }
      }}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
    >
      {isPending ? '...' : 'Xoá'}
    </button>
  )
}
