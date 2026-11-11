import type { MetadataRoute } from 'next'
import { getSiteConfig } from '@/server/site-config'

export const revalidate = 3600

// Next.js serves this as XML at /sitemap.xml
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (await getSiteConfig()).conference.siteUrl.replace(/\/+$/, '')

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/this-year`, lastModified: new Date() },
    { url: `${baseUrl}/documents`, lastModified: new Date() },
    { url: `${baseUrl}/delegate-info`, lastModified: new Date() },
    { url: `${baseUrl}/supervisors`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/legal/tos`, lastModified: new Date() },
    { url: `${baseUrl}/user/login`, lastModified: new Date() },
    { url: `${baseUrl}/user/signup`, lastModified: new Date() },
  ]
}
