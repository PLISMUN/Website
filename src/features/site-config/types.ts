import type { SectionId, SiteConfig } from './schema'

/** A section of the settings as the Settings admin page sees it. */
export type SiteConfigSection<Id extends SectionId = SectionId> = {
  value: SiteConfig[Id]
  // From src/config
  defaultValue: SiteConfig[Id]
  // Both null while the section uses its default
  updatedAt: string | null
  updatedBy: string | null
  // Set if what was saved no longer fits the settings, so the default is being used instead
  problem: string | null
}
