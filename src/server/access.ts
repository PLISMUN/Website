import 'server-only'
import { createHash, timingSafeEqual } from 'crypto'
import { getAccessPassword } from '@/server/site-config'

const digest = (value: string) => createHash('sha256').update(value).digest()

/**
 * Whether key is the current password of the access link, which opens everything that's closed. Read fresh,
 * so a changed password stops old links working straight away.
 *
 * API routes get the key from the cookie the browser keeps it in: req.cookies[ACCESS_COOKIE].
 */
export async function hasAccess(key: unknown): Promise<boolean> {
  if (typeof key !== 'string' || !key) return false
  // Compared as hashes, so they're the same length and the comparison takes as long whatever was guessed
  return timingSafeEqual(digest(key), digest(await getAccessPassword()))
}
