import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  // Bảo vệ: chỉ admin mới upload được
  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const url = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'bds/editor', resource_type: 'image' }, (error, result) => {
          if (error || !result) reject(error || new Error('Upload failed'))
          else resolve(result.secure_url)
        })
        .end(buffer)
    })

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
