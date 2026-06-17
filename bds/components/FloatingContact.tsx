'use client'

import { useState, useEffect } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import ContactForm from '@/components/ContactForm'
import { portfolioData } from '@/lib/constants'

const PHONE = portfolioData.agent.phone
const ZALO = portfolioData.agent.zalo

export default function FloatingContact() {
  const pathname = usePathname()
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : null

  const [open, setOpen] = useState(false)
  const [phoneModal, setPhoneModal] = useState(false)
  const [projectName, setProjectName] = useState<string | null>(null)

  const isHidden = pathname.startsWith('/admin')
  const isProjectPage = !['/', '/du-an'].includes(pathname) && !pathname.startsWith('/admin') && !pathname.startsWith('/api')

  // Fetch tên dự án khi đang ở trang dự án cụ thể
  useEffect(() => {
    if (!slug || !isProjectPage) {
      setProjectName(null)
      return
    }
    fetch(`/api/project-name/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setProjectName(data?.name ?? null))
      .catch(() => setProjectName(null))
  }, [slug, isProjectPage])

  // Auto-open 1 lần/session sau 2 giây
  useEffect(() => {
    if (isHidden) return
    const shown = sessionStorage.getItem('contact_modal_shown')
    if (shown) return
    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem('contact_modal_shown', '1')
    }, 2000)
    return () => clearTimeout(timer)
  }, [pathname, isHidden])

  if (isHidden) return null

  return (
    <>
      {/* ── Nhóm nút nổi góc phải ── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

        {/* Nút Zalo */}
        <motion.a
          href={`https://zalo.me/${ZALO}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          title="Chat Zalo"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
        >
          {/* Zalo logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://banghieuviet.org/wp-content/uploads/2023/08/logo-zalo-tron.jpg" alt="Zalo" className="w-10 h-10 rounded-full object-cover" />
        </motion.a>

        {/* Nút Điện thoại */}
        <motion.button
          onClick={() => setPhoneModal(true)}
          aria-label="Gọi điện thoại"
          title="Gọi điện"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white"
          style={{ background: 'linear-gradient(135deg, #e53e3e, #c53030)' }}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </motion.span>
        </motion.button>

        {/* Nút Tư vấn miễn phí */}
        <motion.button
          onClick={() => setOpen(true)}
          aria-label="Liên hệ tư vấn"
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-bold shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          animate={{
            rotate: [0, -8, 8, -6, 6, -3, 3, 0],
            scale:  [1, 1.05, 1.05, 1.05, 1.05, 1.05, 1.05, 1],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.08, rotate: 0 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </motion.span>
          <span>{isProjectPage ? 'Tải bảng giá' : 'Tư vấn miễn phí'}</span>
        </motion.button>
      </div>

      {/* ── Modal số điện thoại ── */}
      <AnimatePresence>
        {phoneModal && (
          <>
            <motion.div
              key="phone-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPhoneModal(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              key="phone-modal"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl overflow-hidden w-72 max-w-[90vw]">
                {/* Header */}
                <div className="px-6 py-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e53e3e, #c53030)' }}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-2 w-16 h-16 bg-white/10 rounded-full" />
                  <button
                    onClick={() => setPhoneModal(false)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    aria-label="Đóng"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-base leading-tight">Gọi ngay cho tôi</p>
                      <p className="text-red-200 text-xs mt-0.5">Hỗ trợ 7 ngày / tuần</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 text-center">
                  <p className="text-gray-500 text-sm mb-3">Số điện thoại / Hotline</p>
                  <a
                    href={`tel:${PHONE.replace(/\s/g, '')}`}
                    className="block text-3xl font-extrabold text-[#0F4C81] tracking-wide hover:text-red-600 transition-colors mb-5"
                  >
                    {PHONE}
                  </a>
                  <a
                    href={`tel:${PHONE.replace(/\s/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #e53e3e, #c53030)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Gọi ngay
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Modal tư vấn / bảng giá ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 60, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 0.9 }}
              exit={{ opacity: 0, y: 60, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl overflow-hidden origin-bottom-right"
            >
              {/* Header modal */}
              <div className="px-6 py-5 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1e6fb5)' }}>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-2 w-16 h-16 bg-white/10 rounded-full" />

                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  aria-label="Đóng"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-base leading-tight">
                      {isProjectPage ? 'Tải bảng giá chủ đầu tư' : 'Đăng ký tư vấn miễn phí'}
                    </p>
                    <p className="text-blue-200 text-xs mt-0.5">Phản hồi trong vòng 15 phút</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 py-5">
                <ContactForm
                  variant={isProjectPage ? 'price' : 'default'}
                  projectName={projectName ?? undefined}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
