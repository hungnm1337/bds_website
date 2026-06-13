'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createProject, updateProject, deleteProjectImage } from '@/app/admin/actions/project'
import RichTextEditor from '@/components/RichTextEditor'

type GalleryImage = { id: number; image_url: string }
type ProjectData = {
  id: number
  name: string
  address: string
  price: string
  description: string
  detail: string
  main_image_url: string
  project_image: GalleryImage[]
}

interface ProjectFormProps {
  project?: ProjectData
}

// ──────────────────────────────────────────────
// Resize ảnh bằng Canvas API (client-side)
// maxWidth: px tối đa, quality: 0-1
// ──────────────────────────────────────────────
async function resizeImage(file: File, maxWidth = 1920, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          const resized = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
          })
          resolve(resized)
        },
        'image/jpeg',
        quality,
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

// ──────────────────────────────────────────────

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [mainPreview, setMainPreview] = useState<string | null>(null)
  const [mainFile, setMainFile] = useState<File | null>(null)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(project?.project_image ?? [])
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resizing, setResizing] = useState(false)

  const isEdit = !!project
  const HARD_LIMIT = 20 * 1024 * 1024 // 20MB — quá lớn thì reject trước khi resize

  async function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > HARD_LIMIT) {
      setError('Ảnh quá lớn (tối đa 20MB trước khi resize)')
      e.target.value = ''
      return
    }
    setError(null)
    setResizing(true)
    const resized = await resizeImage(file)
    setResizing(false)
    setMainFile(resized)
    setMainPreview(URL.createObjectURL(resized))
  }

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const oversized = files.filter((f) => f.size > HARD_LIMIT)
    if (oversized.length > 0) {
      setError(`${oversized.length} ảnh quá lớn (tối đa 20MB/ảnh trước khi resize): ${oversized.map((f) => f.name).join(', ')}`)
      e.target.value = ''
      setGalleryPreviews([])
      setGalleryFiles([])
      return
    }
    setError(null)
    setResizing(true)
    const resized = await Promise.all(files.map((f) => resizeImage(f)))
    setResizing(false)
    setGalleryFiles(resized)
    setGalleryPreviews(resized.map((f) => URL.createObjectURL(f)))
  }

  async function handleDeleteGalleryImage(imageId: number, imageUrl: string) {
    setDeletingImageId(imageId)
    await deleteProjectImage(imageId, imageUrl)
    setGalleryImages((prev) => prev.filter((img) => img.id !== imageId))
    setDeletingImageId(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    setError(null)

    // Xây FormData thủ công để dùng file đã resize
    const formData = new FormData(form)

    // Thay thế file ảnh bằng file đã resize
    if (mainFile) {
      formData.set('main_image', mainFile, mainFile.name)
    }
    if (galleryFiles.length > 0) {
      formData.delete('gallery_images')
      galleryFiles.forEach((f) => formData.append('gallery_images', f, f.name))
    }

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateProject(project.id, formData)
        } else {
          await createProject(formData)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra'
        if (!msg.includes('NEXT_REDIRECT')) setError(msg)
      }
    })
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm transition-all"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2"

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {resizing && (
        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Đang tối ưu ảnh...
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-4">Thông tin cơ bản</h2>

        {/* Name */}
        <div>
          <label className={labelClass}>Tên dự án <span className="text-red-500">*</span></label>
          <input name="name" type="text" required defaultValue={project?.name} placeholder="VD: Khu đô thị Vinhomes Bắc Ninh" className={inputClass} />
        </div>

        {/* Address + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Địa chỉ <span className="text-red-500">*</span></label>
            <input name="address" type="text" required defaultValue={project?.address} placeholder="VD: Đường Lý Thái Tổ, Bắc Ninh" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Giá <span className="text-red-500">*</span></label>
            <input name="price" type="text" required defaultValue={project?.price} placeholder="VD: 2.5 tỷ" className={inputClass} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Mô tả ngắn <span className="text-red-500">*</span></label>
          <RichTextEditor
            name="description"
            defaultValue={project?.description ?? ''}
            placeholder="Mô tả ngắn gọn về dự án..."
            minHeight="120px"
          />
        </div>

        {/* Detail */}
        <div>
          <label className={labelClass}>Nội dung chi tiết <span className="text-red-500">*</span></label>
          <RichTextEditor
            name="detail"
            defaultValue={project?.detail ?? ''}
            placeholder="Mô tả chi tiết về dự án, tiện ích, pháp lý..."
            minHeight="220px"
          />
        </div>
      </div>

      {/* Main Image */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-5">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-4">
          Ảnh đại diện {isEdit && <span className="text-xs text-gray-400 font-normal ml-1">(để trống nếu không thay đổi)</span>}
        </h2>

        <div className="flex items-start gap-6">
          {/* Preview */}
          <div className="relative w-40 h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
            {mainPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : project?.main_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.main_image_url} alt={project.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Chọn ảnh đại diện
              {/* input chỉ để trigger dialog, file thực dùng state */}
              <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
            </label>
            <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP · Tự động resize về 1920px · Tối đa 20MB</p>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-5">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-4">Ảnh thư viện</h2>

        {/* Existing gallery */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {galleryImages.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden h-24 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteGalleryImage(img.id, img.image_url)}
                  disabled={deletingImageId === img.id}
                  className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {deletingImageId === img.id ? (
                    <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New gallery previews */}
        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {galleryPreviews.map((src, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden h-24 bg-gray-100 ring-2 ring-blue-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm ảnh thư viện
          {/* input chỉ để trigger dialog, file thực dùng state */}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
        </label>
        <p className="text-xs text-gray-400 mt-2">Có thể chọn nhiều ảnh cùng lúc · Tự động resize & nén · Mỗi ảnh tối đa 20MB</p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          type="submit"
          disabled={isPending || resizing}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white text-sm shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#0F4C81,#1e6fb5)' }}
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isEdit ? 'Đang lưu...' : 'Đang tạo...'}
            </>
          ) : (
            isEdit ? 'Lưu thay đổi' : 'Tạo dự án'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
        >
          Huỷ
        </button>
      </div>
    </form>
  )
}
