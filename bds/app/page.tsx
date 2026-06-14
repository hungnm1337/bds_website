import prisma from '@/lib/prisma'
import Hero from '@/components/Hero'
import ProjectsSection from '@/components/ProjectsSection'
import ContactForm from '@/components/ContactForm'
import { portfolioData } from '@/lib/constants'

export default async function Home() {
  const agent = portfolioData.agent

  const projects = await prisma.project.findMany({
    orderBy: { id: 'desc' },
    take: 6
  })

  return (
    <>
      <main className="min-h-screen">
        <Hero agent={agent} />

        {/* Stats */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Kinh nghiệm', value: agent.experience + '+ Năm' },
                { label: 'Dự án tư vấn', value: agent.projectCount + '+' },
                { label: 'Khách hàng', value: agent.clientCount + '+' },
                { label: 'Giá trị GD', value: agent.totalValue }
              ].map((stat, i) => (
                <div key={i} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100">
                  <h3 className="text-3xl font-bold text-[#0F4C81] mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProjectsSection projects={projects} />

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-[#0F4C81] text-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Bạn cần tư vấn bất động sản?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Để lại thông tin, tôi sẽ liên hệ tư vấn chuyên sâu về thị trường
                và các dự án tiềm năng nhất hiện nay.
              </p>
            </div>

            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-8 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Đăng ký nhận tư vấn miễn phí
              </h3>
              <ContactForm />
            </div>

            {/* Contact info row */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-100">
              <a
                href={`tel:${agent.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-70">Hotline</p>
                  <p className="font-bold text-white text-lg">{agent.phone}</p>
                </div>
              </a>
              <div className="hidden sm:block w-px h-12 bg-blue-400/40" />
              <a
                href={`https://zalo.me/${agent.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-70">Zalo</p>
                  <p className="font-bold text-white text-lg">{agent.zalo}</p>
                </div>
              </a>
              <div className="hidden sm:block w-px h-12 bg-blue-400/40" />
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-70">Văn phòng</p>
                  <p className="font-bold text-white text-lg">{agent.address}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} {agent.name} — Chuyên gia tư vấn đầu tư cao cấp

          </p>
          <p className="text-xs mt-1 opacity-60">{agent.address}</p>
        </div>
      </footer>
    </>
  )
}
