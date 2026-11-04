import { describe, expect, it } from 'vitest'
import { conference } from '@/config/conference'
import { documentGroups } from '@/config/documents'
import { generalFaq, supervisorFaq } from '@/config/faq'
import { isPricingTier, pricing } from '@/config/pricing'
import { teamMembers } from '@/config/team'
import {
  conferenceDatesLong,
  conferenceDatesShort,
  conferenceEdition,
  conferenceStartTime,
  conferenceYear,
  siteDomain,
} from '@/lib/conference'

// Catches typos made while updating src/config for a new year
describe('src/config', () => {
  it('has conference dates that make sense', () => {
    expect(Number.isNaN(conferenceStartTime)).toBe(false)
    expect(conference.startsAt).toMatch(/[+-]\d{2}:\d{2}$/)
    expect(conference.endsOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(new Date(`${conference.endsOn}T23:59:59Z`).getTime()).toBeGreaterThan(conferenceStartTime)
  })

  it('has prices that are whole, positive numbers', () => {
    for (const { czk, eur } of Object.values(pricing)) {
      expect(Number.isInteger(czk) && czk > 0).toBe(true)
      expect(Number.isInteger(eur) && eur > 0).toBe(true)
    }
  })

  it('has no two FAQ items with the same id', () => {
    for (const faq of [generalFaq, supervisorFaq]) {
      expect(new Set(faq.map((item) => item.id)).size).toBe(faq.length)
    }
  })

  it('has no two team members with the same name', () => {
    expect(new Set(teamMembers.map((member) => member.name)).size).toBe(teamMembers.length)
  })

  it('has no two document sections with the same id', () => {
    expect(new Set(documentGroups.map((group) => group.id)).size).toBe(documentGroups.length)
  })
})

describe('what the site works out from src/config', () => {
  it('formats the conference dates and edition', () => {
    const year = String(conferenceYear)
    expect(conferenceEdition).toBe(`${conference.name}'${year.slice(-2)}`)
    expect(conferenceDatesShort).toMatch(new RegExp(`^[A-Z][a-z]{2} \\d{1,2} – [A-Z][a-z]{2} \\d{1,2}, ${year}$`))
    expect(conferenceDatesLong).toMatch(new RegExp(`^[A-Z][a-z]+ \\d{1,2}(st|nd|rd|th) – [A-Z][a-z]+ \\d{1,2}(st|nd|rd|th), ${year}$`))
  })

  it('finds the domain of the site', () => {
    expect(siteDomain).not.toContain('www.')
    expect(conference.siteUrl).toContain(siteDomain)
  })

  it('only treats real pricing tiers as tiers', () => {
    expect(isPricingTier('delegate')).toBe(true)
    expect(isPricingTier('constructor')).toBe(false)
    expect(isPricingTier(undefined)).toBe(false)
  })
})
