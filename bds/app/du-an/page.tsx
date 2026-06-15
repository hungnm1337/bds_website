import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { portfolioData } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tất cả dự án bất động sản | ' + portfolioData.agent.name,
  description: 'Khám phá toàn bộ danh sách dự án bất động sản nổi bật do ' + portfolioData.agent.name + ' tư vấn.',
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { id: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-[#0F4C81] pt-32 pb-16 text-white text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Danh sách dự án</h1>
        <p className="text-blue-200 text-lg max-w-xl mx-auto">
          Tổng hợp các dự án bất động sản nổi bật — cập nhật liên tục
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-blue-300 text-sm">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-white font-medium">Dự án</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {projects.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="text-gray-400 text-lg font-medium">Chưa có dự án nào</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-8">{projects.length} dự án</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${project.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={project.main_image_url}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow">
                      {project.price}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.address}
                    </p>
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-[#0F4C81] transition-colors line-clamp-2 mb-3">
                      {project.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F4C81]">
                      Xem chi tiết
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
