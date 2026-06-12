'use client'

import { useActionState } from 'react'
import { loginAction, LoginState } from '@/app/admin/actions/auth'
import { motion } from 'framer-motion'

const initialState: LoginState = null

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #0F4C81 50%, #1a1a2e 100%)' }}>

      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #93c5fd, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #1e6fb5)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-blue-200 text-sm mt-1 opacity-70">Quản lý bất động sản cao cấp</p>
          </div>

          {/* Error */}
          {state?.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-xl text-sm font-medium text-red-200 flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {state.error}
            </motion.div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2 opacity-80">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-blue-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-blue-300 placeholder-opacity-40 text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2 opacity-80">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-blue-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-blue-300 placeholder-opacity-40 text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #1e6fb5)', boxShadow: '0 4px 20px rgba(15,76,129,0.4)' }}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-blue-200 opacity-40 mt-6">
            © {new Date().getFullYear()} BDS Admin — Bảo mật & Riêng tư
          </p>
        </div>
      </motion.div>
    </div>
  )
}
