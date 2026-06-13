'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface HeroProps {
  agent: {
    name: string
    title: string
    bio: string
    image: string
  }
}

export default function Hero({ agent }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0F4C81]/5" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[#0F4C81] font-semibold tracking-wider uppercase mb-4">
              {agent.title}
            </h2>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {agent.name}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 whitespace-pre-line">
              {agent.bio}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="#projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#0F4C81] text-white rounded-lg font-medium shadow-xl hover:bg-[#0d416e] transition-colors"
                >
                  Xem dự án
                </motion.button>
              </Link>
              <Link href="#contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-[#0F4C81] border-2 border-[#0F4C81] rounded-lg font-medium transition-all"
                >
                  Nhận tư vấn miễn phí
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-[220px] h-[300px] lg:w-[320px] lg:h-[440px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden lg:block"
          >
            <p className="text-[#0F4C81] font-bold text-2xl">8+ Năm</p>
            <p className="text-gray-500 text-sm">Kinh nghiệm thực chiến</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
