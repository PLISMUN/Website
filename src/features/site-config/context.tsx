"use client"
import { createContext, useContext, type ReactNode } from 'react'
import type { PublicSiteConfig } from './schema'

const SiteConfigContext = createContext<PublicSiteConfig | null>(null)

/** Given the settings by the root layout, which reads them on the server. */
export function SiteConfigProvider({ config, children }: { config: PublicSiteConfig; children: ReactNode }) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
}

/**
 * The site's current settings: what admins saved on the Settings page, and the defaults from
 * src/config for anything they haven't changed. Server components use getSiteConfig() instead.
 *
 * For what's open, use useStages() from features/access instead, which opens everything for someone
 * who came with the access link.
 */
export function useSiteConfig(): PublicSiteConfig {
  const config = useContext(SiteConfigContext)
  if (!config) throw new Error('useSiteConfig() needs SiteConfigProvider, which app/layout.tsx puts around every page')
  return config
}
