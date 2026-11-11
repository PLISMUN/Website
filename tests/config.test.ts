import { describe, expect, it } from 'vitest'
import { isPricingTier } from '@/config/pricing'
import { describeConference } from '@/lib/conference'
import { SECTION_FORMS, describePath } from '@/features/site-config/fields'
import { fillPlaceholders } from '@/features/site-config/placeholders'
import { SECTION_IDS, defaultSiteConfig, parseSection, sectionSchemas } from '@/features/site-config/schema'

// Catches typos made while updating src/config for a new year: the defaults have to pass the same
// checks as a change made on the Settings admin page
describe('src/config', () => {
  it.each(SECTION_IDS)('has a valid %s section', (id) => {
    const result = parseSection(id, defaultSiteConfig[id])
    expect(result.success ? [] : result.issues).toEqual([])
  })

  it('has conference dates that make sense', () => {
    const { conference } = defaultSiteConfig
    expect(Number.isNaN(describeConference(conference).startTime)).toBe(false)
    expect(conference.startsAt).toMatch(/[+-]\d{2}:\d{2}$/)
    expect(conference.endsOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('what the site works out from the conference settings', () => {
  const described = describeConference(defaultSiteConfig.conference)

  it('formats the conference dates and edition', () => {
    const year = String(described.year)
    expect(described.edition).toBe(`${defaultSiteConfig.conference.name}'${year.slice(-2)}`)
    expect(described.datesShort).toMatch(new RegExp(`^[A-Z][a-z]{2} \\d{1,2} – [A-Z][a-z]{2} \\d{1,2}, ${year}$`))
    expect(described.datesLong).toMatch(new RegExp(`^[A-Z][a-z]+ \\d{1,2}(st|nd|rd|th) – [A-Z][a-z]+ \\d{1,2}(st|nd|rd|th), ${year}$`))
  })

  it('follows a change to the dates', () => {
    const changed = describeConference({ ...defaultSiteConfig.conference, startsAt: '2031-02-03T09:00:00+01:00', endsOn: '2031-02-05' })
    expect(changed.edition).toBe(`${defaultSiteConfig.conference.name}'31`)
    expect(changed.datesShort).toBe('Feb 3 – Feb 5, 2031')
  })

  it('finds the domain of the site', () => {
    expect(described.siteDomain).not.toContain('www.')
    expect(defaultSiteConfig.conference.siteUrl).toContain(described.siteDomain)
  })

  it('only treats real pricing tiers as tiers', () => {
    expect(isPricingTier('delegate')).toBe(true)
    expect(isPricingTier('constructor')).toBe(false)
    expect(isPricingTier(undefined)).toBe(false)
  })
})

describe('checking a change made on the Settings page', () => {
  it('turns down duplicates', () => {
    const [first] = defaultSiteConfig.team
    const result = parseSection('team', [first, { ...first, name: ` ${first.name.toUpperCase()} ` }])
    expect(result.success).toBe(false)
    expect(!result.success && result.issues[0].path).toEqual([1, 'name'])
  })

  it('turns down a conference that ends before it starts', () => {
    const result = parseSection('conference', { ...defaultSiteConfig.conference, endsOn: '2000-01-01' })
    expect(!result.success && result.issues.map((issue) => issue.path)).toEqual([['endsOn']])
  })

  it('only takes links that are links', () => {
    const social = { ...defaultSiteConfig.conference.social, instagram: 'javascript:alert(1)' }
    expect(parseSection('conference', { ...defaultSiteConfig.conference, social }).success).toBe(false)
  })

  it('only takes photos from public/ where next/image needs them', () => {
    const hero = { ...defaultSiteConfig.hero, images: ['https://example.com/photo.jpg'] }
    expect(parseSection('hero', hero).success).toBe(false)
  })

  it('turns down a placeholder that would never be filled in', () => {
    const general = [{ id: 'x', question: 'Price?', answer: 'It costs {delegate.usd}' }]
    const result = parseSection('faq', { ...defaultSiteConfig.faq, general })
    expect(!result.success && result.issues[0].message).toContain('{delegate.usd}')
  })

  it('tidies up what was typed', () => {
    const result = parseSection('payment', { ...defaultSiteConfig.payment, swift: ' bacxczpp ' })
    expect(result.success && result.data.swift).toBe('BACXCZPP')
  })
})

describe('FAQ placeholders', () => {
  it('are filled in from the current settings', () => {
    const pricing = { ...defaultSiteConfig.pricing, delegate: { czk: 1234, eur: 56 } }
    const config = { conference: { ...defaultSiteConfig.conference, contactEmail: 'team@example.com' }, pricing }
    expect(fillPlaceholders('{delegate.czk} CZK (€{delegate.eur}), ask {contactEmail}', config)).toBe('1234 CZK (€56), ask team@example.com')
  })

  it('leave anything else in curly brackets alone', () => {
    expect(fillPlaceholders('{not a placeholder} {nope}', defaultSiteConfig)).toBe('{not a placeholder} {nope}')
  })

  it('are used by the default FAQs instead of prices typed in', () => {
    const answers = Object.values(defaultSiteConfig.faq).flat().map((item) => item.answer).join('\n')
    expect(answers).toContain('{delegate.czk}')
    expect(answers).not.toContain(String(defaultSiteConfig.pricing.delegate.czk))
  })
})

describe('the Settings page', () => {
  it('has a form for every section, and every section has a form', () => {
    expect(SECTION_FORMS.map((form) => form.id).sort()).toEqual([...SECTION_IDS].sort())
  })

  it('only shows fields that exist in the settings', () => {
    const missing: string[] = []
    const check = (field: (typeof SECTION_FORMS)[number]['root'] | Parameters<typeof describePath>[0], value: unknown, where: string) => {
      if (field.kind === 'group') {
        for (const child of field.fields) {
          const object = value as Record<string, unknown>
          if (!(child.key in object)) missing.push(`${where}.${child.key}`)
          else check(child, object[child.key], `${where}.${child.key}`)
        }
      } else if (field.kind === 'list') {
        for (const [index, item] of (value as Record<string, unknown>[]).entries()) {
          for (const child of field.fields) {
            if (!(child.key in item)) missing.push(`${where}.${index}.${child.key}`)
          }
        }
        // A new item has to have every field the section needs
        expect(Object.keys(field.newItem()).sort()).toEqual(expect.arrayContaining(field.fields.map((child) => child.key)))
      }
    }
    for (const form of SECTION_FORMS) check(form.root, defaultSiteConfig[form.id], form.id)
    expect(missing).toEqual([])
  })

  it('names where a problem is', () => {
    const team = SECTION_FORMS.find((form) => form.id === 'team')!
    expect(describePath(team.root, [3, 'name'])).toEqual(['Team member 4', 'Name'])
    const conference = SECTION_FORMS.find((form) => form.id === 'conference')!
    expect(describePath(conference.root, ['social', 'instagram'])).toEqual(['Social media', 'Instagram'])
  })

  it('has a schema for every section it can save', () => {
    expect(Object.keys(sectionSchemas).sort()).toEqual([...SECTION_IDS].sort())
  })
})
