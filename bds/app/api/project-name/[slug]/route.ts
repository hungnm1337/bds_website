import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { name: true },
  })
  if (!project) return NextResponse.json({ name: null }, { status: 404 })
  return NextResponse.json({ name: project.name })
}
