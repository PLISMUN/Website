import { apiPost } from '@/lib/api-client'
import type { SectionId, SiteConfig } from './schema'
import type { SiteConfigSection } from './types'

export const getSiteConfigSections = () =>
  apiPost<{ sections: { [Id in SectionId]: SiteConfigSection<Id> } }>('/api/retrieve/getSiteConfig', 'Failed to load the settings')

/** Throws an ApiRequestError whose data.issues says what to fix if the section isn't valid. */
export const saveSiteConfigSection = <Id extends SectionId>(section: Id, value: SiteConfig[Id], expectedUpdatedAt: string | null) =>
  apiPost('/api/modify/setSiteConfig', 'Failed to save the settings', { action: 'save', section, value, expectedUpdatedAt })

export const resetSiteConfigSection = (section: SectionId, expectedUpdatedAt: string) =>
  apiPost('/api/modify/setSiteConfig', 'Failed to reset the settings', { action: 'reset', section, expectedUpdatedAt })
