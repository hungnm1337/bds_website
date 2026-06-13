'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/constants'

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Dự án', href: '/du-an' },
  { label: 'Về tôi', href: '/#about' },
  { label: 'Liên hệ', href: '/#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const agent = portfolioData.agent

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${
        scrolled ? 'shadow-md py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0F4C81] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-lg leading-none">B</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`font-bold text-base transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              Đại Đô CĐT
            </span>
            <span className="text-[10px] text-[#0F4C81] font-semibold uppercase tracking-widest">
              Bất Động Sản
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[#0F4C81]/10 hover:text-[#0F4C81] ${
                scrolled ? 'text-gray-700' : 'text-gray-700'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${agent.phone.replace(/\s/g, '')}`}
            className={`text-sm font-semibold transition-colors ${
              scrolled ? 'text-gray-700 hover:text-[#0F4C81]' : 'text-gray-700 hover:text-[#0F4C81]'
            }`}
          >
            {agent.phone}
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 bg-[#0F4C81] text-white text-sm font-semibold rounded-xl shadow-lg hover:bg-[#0d416e] hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Tư vấn miễn phí
          </a>
        </div>

        {/* Mobile Burger */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Mở menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-[#0F4C81]/10 hover:text-[#0F4C81] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-4 py-3 bg-[#0F4C81] text-white text-center font-semibold rounded-xl"
              >
                Tư vấn miễn phí
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
