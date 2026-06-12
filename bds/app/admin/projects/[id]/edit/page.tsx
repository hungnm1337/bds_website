import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProjectForm from '../../ProjectForm'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: { project_image: true },
  })

  if (!project) notFound()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa dự án</h1>
        <p className="text-gray-500 text-sm mt-1">{project.name}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
