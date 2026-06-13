'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import ContactForm from '@/components/ContactForm'

export default function FloatingContact() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isHidden = pathname.startsWith('/admin')

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

  // Ẩn trên trang admin và trang chi tiết dự án
  if (isHidden) return null

  return (
    <>
      {/* ── Nút nổi góc phải ── */}
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Liên hệ tư vấn"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-bold shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        // Animation rung liên tục
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
        {/* Icon phone */}
        <motion.span
          animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </motion.span>
        <span>Tư vấn miễn phí</span>
      </motion.button>

      {/* ── Modal ── */}
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
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header modal */}
              <div className="px-6 py-5 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1e6fb5)' }}>
                {/* Decorative circles */}
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
                    <p className="font-bold text-base leading-tight">Đăng ký tư vấn miễn phí</p>
                    <p className="text-blue-200 text-xs mt-0.5">Phản hồi trong vòng 15 phút</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 py-5">
                <ContactForm />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
