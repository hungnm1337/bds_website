'use server'

import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await verifySession()
  if (!session) redirect('/admin/login')
}

export async function markFormRead(id: number) {
  await requireAuth()
  await prisma.contact_form.update({ where: { id }, data: { is_read: true } })
  revalidatePath('/admin/forms')
}

export async function deleteForm(id: number) {
  await requireAuth()
  await prisma.contact_form.delete({ where: { id } })
  revalidatePath('/admin/forms')
}
