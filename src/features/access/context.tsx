"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LockOpen } from 'lucide-react'
import { useSiteConfig } from '@/features/site-config/context'
import type { PublicSiteConfig } from '@/features/site-config/schema'
import { checkAccess } from './api'
import { ACCESS_COOKIE, ACCESS_PARAM } from './constants'

// Whether this visitor has the access link, which opens everything that's closed under "What's open".
//
// The password comes from ?access= in the address, or else the cookie it's kept in once a link has been opened,
// so the link keeps working on pages reached without it. The server checks it (it never sends the password
// here), and only then is anything opened, so a wrong or old password opens nothing.

type Stages = PublicSiteConfig['stages']

const AccessContext = createContext<{ bypass: boolean }>({ bypass: false })

function readCookie(): string | null {
  const entry = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${ACCESS_COOKIE}=`))
  if (!entry) return null
  try {
    return decodeURIComponent(entry.slice(ACCESS_COOKIE.length + 1)) || null
  } catch {
    return null
  }
}

// No expiry, so it goes when the browser is closed
function writeCookie(key: string | null) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = key
    ? `${ACCESS_COOKIE}=${encodeURIComponent(key)}; Path=/; SameSite=Lax${secure}`
    : `${ACCESS_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
}

/** Put around the whole site by app/layout.tsx, inside SiteConfigProvider. */
export function AccessProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { stages } = useSiteConfig()
  const [bypass, setBypass] = useState(false)
  // The last password the server checked, so moving between pages doesn't ask again
  const checked = useRef<{ key: string; valid: boolean } | null>(null)

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get(ACCESS_PARAM) || readCookie()
    if (!key) {
      setBypass(false)
      return
    }

    // Remember a good password for the other pages, and forget one that isn't (any more)
    const apply = (valid: boolean) => {
      writeCookie(valid ? key : null)
      setBypass(valid)
    }

    if (checked.current?.key === key) {
      apply(checked.current.valid)
      return
    }

    let current = true
    checkAccess(key)
      .then((valid) => {
        if (!current) return
        apply(valid)
        checked.current = { key, valid }
      })
      // Can't tell right now: leave things as they are
      .catch(() => {})
    return () => {
      current = false
    }
  }, [pathname])

  const turnOff = useCallback(() => {
    writeCookie(null)
    checked.current = null
    setBypass(false)

    // Take the password out of the address too, and have the server build the page again without it
    const params = new URLSearchParams(window.location.search)
    if (params.has(ACCESS_PARAM)) {
      params.delete(ACCESS_PARAM)
      const query = params.toString()
      router.replace(`${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
    } else {
      router.refresh()
    }
  }, [router])

  const value = useMemo(() => ({ bypass }), [bypass])
  const anythingClosed = Object.values(stages).some((open) => !open)

  return (
    <AccessContext.Provider value={value}>
      {children}
      {bypass && anythingClosed && <AccessNotice onTurnOff={turnOff} />}
    </AccessContext.Provider>
  )
}

/** Whether this visitor has a valid access link. False until the server has checked it. */
export function useAccess() {
  return useContext(AccessContext)
}

/**
 * What's open for this visitor: the stages from the Settings page, or all of them for someone with the access
 * link. Use this rather than useSiteConfig().stages.
 */
export function useStages(): Stages {
  const { stages } = useSiteConfig()
  const { bypass } = useAccess()
  return useMemo(
    () => (bypass ? (Object.fromEntries(Object.keys(stages).map((stage) => [stage, true])) as Stages) : stages),
    [bypass, stages]
  )
}

// So whoever has the link knows why things are open, and an admin trying the link out can turn it off again
function AccessNotice({ onTurnOff }: { onTurnOff: () => void }) {
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-3 py-1.5 text-xs text-sky-900 shadow-lg backdrop-blur"
    >
      <LockOpen className="size-3.5 text-sky-700" aria-hidden="true" />
      <span>You are accessing the website via special access</span>
      <button type="button" onClick={onTurnOff} className="cursor-pointer font-medium underline hover:text-sky-700">
        Turn off
      </button>
    </div>
  )
}
