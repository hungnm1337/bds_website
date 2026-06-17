'use client'

import { useActionState } from 'react'
import { useRef, useEffect, useState } from 'react'
import { submitContactForm, ContactFormState } from '@/app/actions/contact'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const initialState: ContactFormState = null

function Toast({ state, onClose }: { state: NonNullable<ContactFormState>; onClose: () => void }) {
  // Auto-close sau 3s
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`fixed top-6 left-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold min-w-[280px] max-w-sm ${
        state.success
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {/* Icon */}
      <span className="shrink-0 w-5 h-5">
        {state.success ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </span>

      <span className="flex-1">{state.message}</span>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 rounded-b-2xl bg-white/40"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 3, ease: 'linear' }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="shrink-0 ml-1 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Đóng thông báo"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </motion.div>,
    document.body
  )
}

interface ContactFormProps {
  variant?: 'default' | 'price'
  /** Tên dự án, dùng để tạo message mặc định khi variant = 'price' */
  projectName?: string
}

export default function ContactForm({ variant = 'default', projectName }: ContactFormProps) {
  const isPriceVariant = variant === 'price'
  const defaultMessage = isPriceVariant && projectName
    ? `Tôi muốn nhận bảng giá mới nhất của dự án ${projectName}.`
    : 'Tôi muốn nhận bảng giá mới nhất.'
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [showToast, setShowToast] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const prevStateRef = useRef<ContactFormState>(null)

  useEffect(() => {
    if (state && state !== prevStateRef.current) {
      prevStateRef.current = state
      setShowToast(true)
      if (state.success) {
        formRef.current?.reset()
      }
    }
  }, [state])

  return (
    <>
      {/* Toast portal */}
      <AnimatePresence>
        {showToast && state && (
          <Toast state={state} onClose={() => setShowToast(false)} />
        )}
      </AnimatePresence>

      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-gray-700 text-sm font-semibold mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Nguyễn Văn A"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition-all placeholder:text-gray-400"
          />
        </div>

        <div>
          <label htmlFor="phone_number" className="block text-gray-700 text-sm font-semibold mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            placeholder="0901 234 567"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition-all placeholder:text-gray-400"
          />
        </div>

        {isPriceVariant ? (
          <input type="hidden" name="message" value={defaultMessage} />
        ) : (
          <div>
            <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">
              Nhu cầu / Tin nhắn
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Tôi muốn tìm hiểu về các dự án căn hộ cao cấp tại Bắc Ninh..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition-all resize-none placeholder:text-gray-400"
            />
          </div>
        )}

        <button
          type="submit"
          id="contact-submit-btn"
          disabled={isPending}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang gửi...
            </span>
          ) : (
            isPriceVariant ? 'TẢI NGAY' : 'GỬI YÊU CẦU NGAY'
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Cam kết bảo mật thông tin tuyệt đối
        </p>
      </form>
    </>
  )
}
