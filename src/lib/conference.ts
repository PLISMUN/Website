import type { SiteConfig } from '@/features/site-config/schema'

type Conference = Pick<SiteConfig['conference'], 'name' | 'startsAt' | 'endsOn' | 'timeZone' | 'siteUrl'>

const ordinal = (day: number) => {
  const tens = day % 100
  if (tens >= 11 && tens <= 13) return `${day}th`
  return `${day}${{ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th'}`
}

/**
 * Everything the site works out from the conference settings, so a date only has to be changed once.
 * Use it with the conference from useSiteConfig() or getSiteConfig().
 */
export function describeConference(conference: Conference) {
  const opening = new Date(conference.startsAt)
  // Midday UTC is the same calendar day in any time zone a conference could reasonably be in
  const closing = new Date(`${conference.endsOn}T12:00:00Z`)

  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { timeZone: conference.timeZone, ...options }).format(date)
  const dayOfMonth = (date: Date) => Number(format(date, { day: 'numeric' }))

  const year = Number(format(opening, { year: 'numeric' }))

  return {
    /** Milliseconds since the epoch at which the conference opens */
    startTime: opening.getTime(),
    year,
    /** PLISMUN'XX */
    edition: `${conference.name}'${String(year).slice(-2)}`,
    /** January 28th – January 31st, 2027 */
    datesLong:
      `${format(opening, { month: 'long' })} ${ordinal(dayOfMonth(opening))} – ` +
      `${format(closing, { month: 'long' })} ${ordinal(dayOfMonth(closing))}, ${year}`,
    /** Jan 28 – Jan 31, 2027 */
    datesShort:
      `${format(opening, { month: 'short' })} ${dayOfMonth(opening)} – ` +
      `${format(closing, { month: 'short' })} ${dayOfMonth(closing)}, ${year}`,
    /** plismun.com */
    siteDomain: new URL(conference.siteUrl).hostname.replace(/^www\./, ''),
  }
}
