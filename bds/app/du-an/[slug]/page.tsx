import prisma from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import GallerySlider from '@/components/GallerySlider'
import ContactForm from '@/components/ContactForm'

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
          priority
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
          <div className="lg:col-span-2 space-y-10">

            {/* Tổng quan */}
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

            {/* Thư viện ảnh — đặt trên mô tả */}
            {project.project_image.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-5">Thư viện hình ảnh</h2>
                <div className="px-6">
                  <GallerySlider
                    images={project.project_image}
                    projectName={project.name}
                  />
                </div>
              </section>
            )}

            {/* Mô tả */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Mô tả dự án</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </section>

            {/* Chi tiết */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: project.detail }}
              />
            </section>

          </div>

          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-100 shadow-2xl rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 text-center">Đăng ký tư vấn miễn phí</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

