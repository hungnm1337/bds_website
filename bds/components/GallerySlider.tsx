'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface GallerySliderProps {
  images: { id: number; image_url: string }[]
  projectName: string
}

export default function GallerySlider({ images, projectName }: GallerySliderProps) {
  const [startIndex, setStartIndex] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null) // index of enlarged image

  const PER_PAGE = 3
  const total = images.length
  const canPrev = startIndex > 0
  const canNext = startIndex + PER_PAGE < total

  const prev = useCallback(() => {
    setStartIndex((i) => Math.max(0, i - 1))
  }, [])

  const next = useCallback(() => {
    setStartIndex((i) => Math.min(total - PER_PAGE, i + 1))
  }, [total])

  const openLightbox = (index: number) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prevLightbox = () => setLightbox((i) => (i !== null ? Math.max(0, i - 1) : null))
  const nextLightbox = () => setLightbox((i) => (i !== null ? Math.min(total - 1, i + 1) : null))

  const visibleImages = images.slice(startIndex, startIndex + PER_PAGE)

  return (
    <>
      {/* ── Slider ── */}
      <div className="relative">
        {/* Arrow Prev */}
        <button
          onClick={prev}
          disabled={!canPrev}
          aria-label="Ảnh trước"
          className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-gray-200 bg-white transition-all
            ${canPrev ? 'hover:bg-[#0F4C81] hover:text-white hover:border-[#0F4C81] cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Images */}
        <div className="grid grid-cols-3 gap-3 overflow-hidden">
          {visibleImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => openLightbox(startIndex + i)}
              className="relative h-52 rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
              aria-label={`Xem ảnh ${startIndex + i + 1}`}
            >
              <Image
                src={img.image_url}
                alt={`${projectName} - ảnh ${startIndex + i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 280px"
              />
              {/* Zoom icon overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-6-3v6m-3-3h6" />
                  </svg>
                </div>
              </div>
            </button>
          ))}

          {/* Placeholder nếu < 3 ảnh visible */}
          {visibleImages.length < PER_PAGE &&
            Array.from({ length: PER_PAGE - visibleImages.length }).map((_, i) => (
              <div key={`ph-${i}`} className="h-52 rounded-xl bg-gray-100" />
            ))}
        </div>

        {/* Arrow Next */}
        <button
          onClick={next}
          disabled={!canNext}
          aria-label="Ảnh tiếp theo"
          className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-gray-200 bg-white transition-all
            ${canNext ? 'hover:bg-[#0F4C81] hover:text-white hover:border-[#0F4C81] cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      {total > PER_PAGE && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: total - PER_PAGE + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === startIndex ? 'bg-[#0F4C81] w-5' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Đến ảnh ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightbox + 1} / {total}
          </div>

          {/* Prev lightbox */}
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox() }}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Ảnh trước"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] mx-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox].image_url}
              alt={`${projectName} - ảnh ${lightbox + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
              priority
            />
          </div>

          {/* Next lightbox */}
          {lightbox < total - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox() }}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Ảnh tiếp"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}
