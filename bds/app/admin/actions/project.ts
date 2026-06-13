'use server'

import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

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
  const mainImageFile = formData.get('main_image') as File
  const galleryFiles = formData.getAll('gallery_images') as File[]

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB safety net

  let mainImageUrl = ''
  if (mainImageFile && mainImageFile.size > 0) {
    mainImageUrl = await uploadToCloudinary(mainImageFile, 'bds/projects')
  }

  const project = await prisma.project.create({
    data: { name, address, price, description, detail, main_image_url: mainImageUrl },
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
  const mainImageFile = formData.get('main_image') as File
  const galleryFiles = formData.getAll('gallery_images') as File[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { name, address, price, description, detail }

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
