'use server'

import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

function generateSlug(text: string) {
  return text.toString().toLowerCase()
    .normalize('NFD') // Tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xoá dấu
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9-]/g, '-') // Xoá toàn bộ ký tự không phải chữ/số/gạch ngang và thay bằng gạch ngang
    .replace(/-+/g, '-') // Gom nhiều gạch ngang thành 1
    .replace(/^-|-$/g, '') // Cắt gạch ngang ở đầu và cuối
}

async function generateUniqueSlug(baseName: string, explicitSlug?: string, excludeId?: number) {
  let slug = explicitSlug ? generateSlug(explicitSlug) : generateSlug(baseName)
  if (!slug) slug = 'du-an'

  let counter = 1
  let uniqueSlug = slug
  while (true) {
    const existing = await prisma.project.findFirst({
      where: { slug: uniqueSlug, ...(excludeId ? { NOT: { id: excludeId } } : {}) }
    })
    if (!existing) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }
  return uniqueSlug
}

async function requireAuth() {
  const session = await verifySession()
  if (!session) redirect('/admin/login')
}

export async function createProject(formData: FormData) {
  await requireAuth()

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string
  const detail = formData.get('detail') as string
  const formSlug = formData.get('slug') as string
  const mainImageFile = formData.get('main_image') as File
  const galleryFiles = formData.getAll('gallery_images') as File[]

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB safety net

  let mainImageUrl = ''
  if (mainImageFile && mainImageFile.size > 0) {
    mainImageUrl = await uploadToCloudinary(mainImageFile, 'bds/projects')
  }

  const slug = await generateUniqueSlug(name, formSlug)

  const project = await prisma.project.create({
    data: { name, slug, address, price, description, detail, main_image_url: mainImageUrl },
  })

  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      const url = await uploadToCloudinary(file, 'bds/gallery')
      await prisma.project_image.create({
        data: { project_id: project.id, image_url: url },
      })
    }
  }

  revalidatePath('/admin/projects')
  redirect('/admin/projects')
}

export async function updateProject(id: number, formData: FormData) {
  await requireAuth()

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string
  const detail = formData.get('detail') as string
  const formSlug = formData.get('slug') as string
  const mainImageFile = formData.get('main_image') as File
  const galleryFiles = formData.getAll('gallery_images') as File[]

  const slug = await generateUniqueSlug(name, formSlug, id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { name, slug, address, price, description, detail }

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB safety net

  if (mainImageFile && mainImageFile.size > 0) {
    updateData.main_image_url = await uploadToCloudinary(mainImageFile, 'bds/projects')
  }

  await prisma.project.update({ where: { id }, data: updateData })

  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      const url = await uploadToCloudinary(file, 'bds/gallery')
      await prisma.project_image.create({ data: { project_id: id, image_url: url } })
    }
  }

  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}/edit`)
  redirect('/admin/projects')
}

export async function deleteProject(id: number) {
  await requireAuth()
  await prisma.project.delete({ where: { id } })
  revalidatePath('/admin/projects')
}

export async function deleteProjectImage(imageId: number, imageUrl: string) {
  await requireAuth()
  await deleteFromCloudinary(imageUrl)
  await prisma.project_image.delete({ where: { id: imageId } })
  revalidatePath('/admin/projects')
}
