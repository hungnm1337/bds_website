import prisma from '@/lib/prisma'
import Link from 'next/link'
import ProjectActions from './ProjectActions'

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { id: 'desc' },
    include: { project_image: true },
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dự án</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} dự án</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#0F4C81,#1e6fb5)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm dự án
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-400 font-medium">Chưa có dự án nào</p>
          <Link href="/admin/projects/new" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            Thêm dự án đầu tiên →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {project.main_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.main_image_url}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-green-700 rounded-lg shadow-sm">
                    {project.price}
                  </span>
                </div>
                {project.project_image.length > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                      +{project.project_image.length} ảnh
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{project.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{project.address}</span>
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 mb-4">{project.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex-1 text-center py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    Chỉnh sửa
                  </Link>
                  <ProjectActions id={project.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
