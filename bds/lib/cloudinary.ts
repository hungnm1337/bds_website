import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(file: File, folder = 'bds'): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'))
        else resolve(result.secure_url)
      })
      .end(buffer)
  })
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)
    if (!matches) return
    const publicId = matches[1]
    await cloudinary.uploader.destroy(publicId)
  } catch (e) {
    console.error('Cloudinary delete error:', e)
  }
}
