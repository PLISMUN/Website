import { conference } from '@/config/conference'

// Everything here is worked out from src/config/conference.ts, so a date only has to be changed once.

const opening = new Date(conference.startsAt)
// Midday UTC is the same calendar day in any time zone a conference could reasonably be in
const closing = new Date(`${conference.endsOn}T12:00:00Z`)

const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', { timeZone: conference.timeZone, ...options }).format(date)

const ordinal = (day: number) => {
  const tens = day % 100
  if (tens >= 11 && tens <= 13) return `${day}th`
  return `${day}${{ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th'}`
}

const dayOfMonth = (date: Date) => Number(format(date, { day: 'numeric' }))

/** Milliseconds since the epoch at which the conference opens */
export const conferenceStartTime = opening.getTime()

export const conferenceYear = Number(format(opening, { year: 'numeric' }))

/** PLISMUN'XX */
export const conferenceEdition = `${conference.name}'${String(conferenceYear).slice(-2)}`

/** January 28th – January 31st, 2027 */
export const conferenceDatesLong =
  `${format(opening, { month: 'long' })} ${ordinal(dayOfMonth(opening))} – ` +
  `${format(closing, { month: 'long' })} ${ordinal(dayOfMonth(closing))}, ${conferenceYear}`

/** Jan 28 – Jan 31, 2027 */
export const conferenceDatesShort =
  `${format(opening, { month: 'short' })} ${dayOfMonth(opening)} – ` +
  `${format(closing, { month: 'short' })} ${dayOfMonth(closing)}, ${conferenceYear}`

/** plismun.com */
export const siteDomain = new URL(conference.siteUrl).hostname.replace(/^www\./, '')
