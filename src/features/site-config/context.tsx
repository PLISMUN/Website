"use client"
import { createContext, useContext, type ReactNode } from 'react'
import type { SiteConfig } from './schema'

const SiteConfigContext = createContext<SiteConfig | null>(null)

/** Given the settings by the root layout, which reads them on the server. */
export function SiteConfigProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
}

/**
 * The site's current settings: what admins saved on the Settings page, and the defaults from
 * src/config for anything they haven't changed. Server components use getSiteConfig() instead.
 */
export function useSiteConfig(): SiteConfig {
  const config = useContext(SiteConfigContext)
  if (!config) throw new Error('useSiteConfig() needs SiteConfigProvider, which app/layout.tsx puts around every page')
  return config
}
