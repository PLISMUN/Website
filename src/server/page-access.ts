import 'server-only'
import { cookies } from 'next/headers'
import { ACCESS_COOKIE, ACCESS_PARAM } from '@/features/access/constants'
import { hasAccess } from '@/server/access'

// Separate from src/server/access.ts because next/headers only works in the App Router, and API routes in
// src/pages use that one

export type SearchParams = Promise<Record<string, string | string[] | undefined>>

/**
 * For a page that's built on every request (everything under /user): whether the visitor has the access link,
 * from ?access= or, failing that, the cookie the browser keeps it in. The same order as AccessProvider.
 */
export async function pageHasAccess(searchParams: SearchParams): Promise<boolean> {
  const fromUrl = (await searchParams)[ACCESS_PARAM]
  const key = (Array.isArray(fromUrl) ? fromUrl[0] : fromUrl) ?? (await cookies()).get(ACCESS_COOKIE)?.value
  return hasAccess(key)
}
