import type { SiteConfig } from './schema'

type Values = Pick<SiteConfig, 'conference' | 'pricing'>

// What can be written in curly brackets in a FAQ, so an answer doesn't go stale when a price or the
// contact address changes. The descriptions are shown on the Settings admin page.
export const PLACEHOLDERS: Record<string, { description: string; value: (config: Values) => string | number }> = {
  contactEmail: { description: 'the contact address', value: (c) => c.conference.contactEmail },
  'delegate.czk': { description: 'the delegate fee in CZK', value: (c) => c.pricing.delegate.czk },
  'delegate.eur': { description: 'the delegate fee in EUR', value: (c) => c.pricing.delegate.eur },
  'chair.czk': { description: 'the chair fee in CZK', value: (c) => c.pricing.chair.czk },
  'chair.eur': { description: 'the chair fee in EUR', value: (c) => c.pricing.chair.eur },
  'supervisor.czk': { description: 'the supervisor fee in CZK', value: (c) => c.pricing.supervisor.czk },
  'supervisor.eur': { description: 'the supervisor fee in EUR', value: (c) => c.pricing.supervisor.eur },
}

/** "The fee is {delegate.czk} CZK" -> "The fee is 1700 CZK". Anything unknown is left as it is. */
export function fillPlaceholders(text: string, config: Values): string {
  return text.replace(/\{([^{}\s]+)\}/g, (match, name: string) =>
    Object.hasOwn(PLACEHOLDERS, name) ? String(PLACEHOLDERS[name].value(config)) : match
  )
}
