'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  id: number
  name: string
  address: string
  price: string
  main_image_url: string
  slug: string
}

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Dự Án Nổi Bật
          </motion.h2>
          <div className="w-20 h-1 bg-[#0F4C81] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.main_image_url}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{project.address}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#0F4C81] transition-colors line-clamp-1">
                  {project.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#0F4C81]">{project.price}</span>
                  <Link href={`/${project.slug}`}>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="text-gray-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Chi tiết →
                    </motion.span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nút xem thêm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/du-an"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F4C81] text-white font-semibold rounded-2xl shadow-lg hover:bg-[#0d416e] hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Xem tất cả dự án
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
