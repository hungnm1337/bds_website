'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-3xl bg-[#0F4C81]/8 flex items-center justify-center">
              <svg className="w-16 h-16 text-[#0F4C81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>

          {/* 404 number */}
          <h1 className="text-8xl font-bold text-[#0F4C81] mb-4 leading-none">404</h1>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Trang không tồn tại
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Dự án hoặc trang bạn tìm kiếm đã bị di chuyển hoặc không còn tồn tại.
            Hãy quay lại trang chủ để xem các dự án bất động sản mới nhất.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F4C81] text-white font-semibold rounded-2xl shadow-lg hover:bg-[#0d416e] hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </Link>
            <Link
              href="/du-an"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F4C81] border-2 border-[#0F4C81] font-semibold rounded-2xl hover:bg-[#0F4C81]/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H7m0 0l4-4m-4 4l4 4" />
              </svg>
              Xem tất cả dự án
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
