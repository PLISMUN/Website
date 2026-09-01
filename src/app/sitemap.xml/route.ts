import { MetadataRoute } from 'next'

export function GET() {
  const baseUrl = 'https://www.plismun.com'

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/this-year`, lastModified: new Date() },
    { url: `${baseUrl}/documents`, lastModified: new Date() },
    { url: `${baseUrl}/delegate-info`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/legal/tos`, lastModified: new Date() },
    { url: `${baseUrl}/user/login`, lastModified: new Date() },
    { url: `${baseUrl}/user/signup`, lastModified: new Date() },
  ]

  return Response.json(routes)
}