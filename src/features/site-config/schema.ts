import { z } from 'zod'
import { about } from '@/config/about'
import { conference } from '@/config/conference'
import { documents } from '@/config/documents'
import { email } from '@/config/email'
import { delegateFaq, generalFaq, supervisorFaq } from '@/config/faq'
import { hero } from '@/config/hero'
import { partners } from '@/config/partners'
import { paymentDetails } from '@/config/payment'
import { pricing } from '@/config/pricing'
import { schedule } from '@/config/schedule'
import { stages } from '@/config/stages'
import { teamMembers } from '@/config/team'
import { venues } from '@/config/venues'
import { PLACEHOLDERS } from './placeholders'

// What the Settings admin page can change, and what a saved change has to look like. The files in
// src/config are the defaults: a section nobody has changed (or that was reset) reads from there.

const text = (max: number) =>
  z.string().trim().min(1, 'This can’t be empty').max(max, `Keep this to ${max} characters or fewer`)

const wholeNumber = (min: number, max: number) =>
  z.number({ invalid_type_error: 'Enter a number' }).int('Enter a whole number').min(min, `The smallest allowed is ${min}`).max(max, `The largest allowed is ${max}`)

const webLink = z
  .string()
  .trim()
  .regex(/^https?:\/\/[^\s/$.?#][^\s]*$/i, 'Enter a full link starting with https://')

// Shown with next/image, which only takes files from public/ unless next.config.ts allows other sites
const localFile = z
  .string()
  .trim()
  .regex(/^\/[^\s]+$/, 'Enter a file in public/, starting with / (like /headers/photo.webp)')

const imageSource = z
  .string()
  .trim()
  .regex(/^(\/[^\s]+|https?:\/\/[^\s]+)$/i, 'Enter a file in public/ starting with /, or a link starting with https://')

const unique = <T extends Record<string, unknown>>(field: keyof T & string, what: string) =>
  (items: T[], ctx: z.RefinementCtx) => {
    const seen = new Set<string>()
    items.forEach((item, index) => {
      const value = String(item[field]).trim().toLowerCase()
      if (seen.has(value)) ctx.addIssue({ code: 'custom', path: [index, field], message: `Two ${what} can’t have the same ${field}` })
      seen.add(value)
    })
  }

const isTimeZone = (value: string) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value })
    return true
  } catch {
    return false
  }
}

const price = z.object({ czk: wholeNumber(1, 1_000_000), eur: wholeNumber(1, 100_000) })

const bankAccount = z.object({
  accountNumber: text(50),
  iban: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9 ]{10,40}$/, 'Enter an IBAN, like CZ88 2700 0000 0021 0791 4717'),
})

const knownPlaceholders = (value: string, ctx: z.RefinementCtx) => {
  for (const [, name] of value.matchAll(/\{([^{}\s]+)\}/g)) {
    if (!Object.hasOwn(PLACEHOLDERS, name)) {
      ctx.addIssue({ code: 'custom', message: `{${name}} isn’t something that can be filled in. Use one of ${Object.keys(PLACEHOLDERS).map((key) => `{${key}}`).join(', ')}` })
    }
  }
}

const faqList = z
  .array(
    z.object({
      id: z.string().trim().min(1).max(100),
      question: text(300).superRefine(knownPlaceholders),
      answer: text(5000).superRefine(knownPlaceholders),
    })
  )
  .superRefine(unique('id', 'questions'))

export const sectionSchemas = {
  conference: z
    .object({
      name: text(50),
      host: text(200),
      city: text(100),
      timeZone: text(100).refine(isTimeZone, 'Enter a time zone like Europe/Prague'),
      startsAt: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?[+-]\d{2}:\d{2}$/, 'Write it like 2027-01-28T09:00:00+01:00')
        .refine((value) => !Number.isNaN(Date.parse(value)), 'That isn’t a real date and time'),
      endsOn: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Write it like 2027-01-31')
        .refine((value) => !Number.isNaN(Date.parse(`${value}T12:00:00Z`)), 'That isn’t a real date'),
      siteUrl: webLink,
      contactEmail: z.string().trim().email('Enter an email address'),
      mymun: z.object({
        conferenceId: wholeNumber(1, 1_000_000_000),
        pageUrl: webLink,
      }),
      social: z.object({
        facebook: webLink,
        instagram: webLink,
        linkedin: webLink,
      }),
      beholdFeedId: text(100),
      stats: z.object({
        attendeesBeforeMymun: wholeNumber(0, 1_000_000),
        internationalDelegations: text(20),
      }),
      credits: z.object({
        maintainedBy: z.array(text(100)).min(1, 'List at least one person'),
      }),
    })
    .refine((value) => Date.parse(`${value.endsOn}T23:59:59Z`) > Date.parse(value.startsAt), {
      path: ['endsOn'],
      message: 'The conference has to end on or after the day it opens',
    }),

  stages: z.object({
    accountCreation: z.boolean(),
    paymentsAccepted: z.boolean(),
    chairApplication: z.boolean(),
    delegateApplication: z.boolean(),
    supervisorApplication: z.boolean(),
  }),

  pricing: z.object({
    delegate: price,
    chair: price,
    supervisor: price,
  }),

  payment: z.object({
    recipient: text(200),
    bank: text(200),
    swift: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{8}([A-Z0-9]{3})?$/, 'Enter an 8 or 11 character SWIFT/BIC code'),
    variableSymbol: z.string().trim().regex(/^\d{1,10}$/, 'Enter up to 10 digits'),
    czk: bankAccount,
    eur: bankAccount,
  }),

  hero: z.object({
    tagline: text(500),
    images: z.array(localFile).min(1, 'Add at least one photo'),
    stackedImages: z.array(localFile).min(1, 'Add at least one photo'),
  }),

  partners: z.array(z.object({ logo: imageSource, alt: text(200) })),

  team: z
    .array(
      z.object({
        src: imageSource,
        name: text(100),
        role: text(200),
        description: text(5000),
      })
    )
    .superRefine(unique('name', 'team members')),

  venues: z.array(z.object({ name: text(100), image: imageSource, description: text(2000) })),

  schedule: z.object({
    image: localFile,
    alt: text(200),
    width: wholeNumber(1, 20_000),
    height: wholeNumber(1, 20_000),
    background: imageSource,
  }),

  faq: z.object({
    general: faqList,
    delegate: faqList,
    supervisor: faqList,
  }),

  about: z.object({
    heading: text(200),
    paragraphs: z.array(text(5000)).min(1, 'Add at least one paragraph'),
  }),

  documents: z.object({
    groups: z
      .array(
        z.object({
          id: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes, like study-guides').max(60),
          heading: text(100),
          blurb: text(300),
        })
      )
      .superRefine(unique('id', 'sections')),
    maxSizeMb: wholeNumber(1, 500),
    titleMaxLength: wholeNumber(10, 500),
    descriptionMaxLength: wholeNumber(10, 2000),
  }),

  email: z.object({
    senderName: text(100),
  }),
}

export type SectionId = keyof typeof sectionSchemas
export type SiteConfig = { [Id in SectionId]: z.infer<(typeof sectionSchemas)[Id]> }

export const SECTION_IDS = Object.keys(sectionSchemas) as SectionId[]

export const isSectionId = (value: unknown): value is SectionId =>
  typeof value === 'string' && Object.hasOwn(sectionSchemas, value)

export const defaultSiteConfig: SiteConfig = {
  conference,
  stages,
  pricing,
  payment: paymentDetails,
  hero,
  partners,
  team: teamMembers,
  venues,
  schedule,
  faq: { general: generalFaq, delegate: delegateFaq, supervisor: supervisorFaq },
  about,
  documents,
  email,
}

export type ConfigIssue = { path: (string | number)[]; message: string }

/** Checks a section the way the server does before saving it. */
export function parseSection<Id extends SectionId>(
  id: Id,
  value: unknown
): { success: true; data: SiteConfig[Id] } | { success: false; issues: ConfigIssue[] } {
  const result = sectionSchemas[id].safeParse(value)
  if (result.success) return { success: true, data: result.data as SiteConfig[Id] }
  return {
    success: false,
    issues: result.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
  }
}
