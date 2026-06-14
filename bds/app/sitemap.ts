import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.daidocdt.com'

  // Fetch all projects to generate dynamic routes
  const projects = await prisma.project.findMany({
    select: {
      slug: true,
      created_at: true,
    },
  })

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/${project.slug}`,
    lastModified: project.created_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/du-an`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...projectUrls,
  ]
}
