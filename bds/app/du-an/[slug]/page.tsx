import prisma from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projectId = parseInt(slug)
  
  if (isNaN(projectId)) notFound()

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { project_image: true }
  })

  if (!project) notFound()

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Project */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={project.main_image_url}
          alt={project.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container mx-auto px-6 py-12 text-white">
            <h1 className="text-4xl lg:text-6xl font-bold">{project.name}</h1>
            <p className="text-xl mt-4 opacity-90">{project.address}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Thông tin tổng quan</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl">
                <div>
                  <p className="text-gray-500 text-sm">Giá từ</p>
                  <p className="font-bold text-[#0F4C81]">{project.price}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Vị trí</p>
                  <p className="font-bold">{project.address}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Mô tả dự án</h2>
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                {project.description}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h2>
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                {project.detail}
              </div>
            </section>

            {project.project_image.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Thư viện hình ảnh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.project_image.map((img) => (
                    <div key={img.id} className="relative h-64 rounded-xl overflow-hidden shadow-md">
                      <Image src={img.image_url} alt="Gallery" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-100 shadow-2xl rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 text-center">Nhận bảng giá & Chính sách</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Họ tên" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0F4C81] outline-none" />
                <input type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0F4C81] outline-none" />
                <button className="w-full py-4 bg-[#0F4C81] text-white font-bold rounded-lg hover:bg-[#0d416e] transition-colors">
                  TẢI BẢNG GIÁ
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">
                * Cam kết bảo mật thông tin khách hàng tuyệt đối.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
