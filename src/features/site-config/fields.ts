import type { SectionId } from './schema'
import { PLACEHOLDERS } from './placeholders'

// How each section of the settings is laid out on the Settings admin page. Only the fields listed
// here are shown; anything else in a section (like the IDs of FAQ items) is kept as it is.

type Base = { key: string; label: string; help?: string }

export type Field =
  | (Base & { kind: 'text'; multiline?: boolean; image?: boolean; placeholder?: string })
  | (Base & { kind: 'number' })
  | (Base & { kind: 'boolean' })
  | (Base & { kind: 'group'; fields: Field[] })
  | (Base & { kind: 'textList'; itemLabel: string; multiline?: boolean; image?: boolean })
  | (Base & {
      kind: 'list'
      itemLabel: string
      // The field shown as the title of each item, so a long list can be scanned while collapsed
      titleKey?: string
      fields: Field[]
      newItem: () => Record<string, unknown>
    })

export type SectionForm = {
  id: SectionId
  title: string
  description: string
  // The file the defaults come from
  file: string
  // The section's own fields: a group for most, a list for sections that are one
  root: Extract<Field, { kind: 'group' } | { kind: 'list' }>
}

const text = (key: string, label: string, help?: string, extra: Partial<Extract<Field, { kind: 'text' }>> = {}): Field =>
  ({ kind: 'text', key, label, help, ...extra })
const number = (key: string, label: string, help?: string): Field => ({ kind: 'number', key, label, help })
const toggle = (key: string, label: string, help?: string): Field => ({ kind: 'boolean', key, label, help })
const group = (key: string, label: string, fields: Field[], help?: string): Field => ({ kind: 'group', key, label, fields, help })
const root = (fields: Field[]): SectionForm['root'] => ({ kind: 'group', key: '', label: '', fields })

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)

const price = (key: string, label: string) =>
  group(key, label, [number('czk', 'CZK'), number('eur', 'EUR')])

const bankAccount = (key: string, label: string) =>
  group(key, label, [text('accountNumber', 'Account number', 'For Czech banks, like 2107914717/2700'), text('iban', 'IBAN')])

const faqList = (key: string, label: string, help: string): Field => ({
  kind: 'list',
  key,
  label,
  help,
  itemLabel: 'Question',
  titleKey: 'question',
  fields: [text('question', 'Question'), text('answer', 'Answer', 'Line breaks are kept.', { multiline: true })],
  newItem: () => ({ id: newId(), question: '', answer: '' }),
})

const placeholderList = Object.entries(PLACEHOLDERS)
  .map(([name, { description }]) => `{${name}} for ${description}`)
  .join(', ')

export const SECTION_FORMS: SectionForm[] = [
  {
    id: 'stages',
    title: 'What’s open',
    description: 'Open and close parts of the conference during the year.',
    file: 'stages.ts',
    root: root([
      toggle(
        'accountCreation',
        'Accounts and the portal',
        'When off, nobody can sign up or log in, and the portal pages are hidden. Admins who are already signed in can still use the admin pages, including this one.'
      ),
      toggle('delegateApplication', 'Delegate applications', 'When off, the buttons to apply as a delegate are disabled.'),
      toggle('chairApplication', 'Chair applications', 'When off, the buttons to apply as a chair are disabled.'),
      toggle('supervisorApplication', 'Supervisor applications', 'When off, supervisors can’t submit an application.'),
      toggle('paymentsAccepted', 'Payments', 'When off, the Payment page says payments aren’t being accepted instead of showing the bank details.'),
    ]),
  },
  {
    id: 'conference',
    title: 'Conference',
    description: 'The dates, links and contact address used all over the site and in emails.',
    file: 'conference.ts',
    root: root([
      text('name', 'Name', 'Used for the edition shown on the site, like PLISMUN’27, and to sign off emails.'),
      text('host', 'Host school'),
      text('city', 'City'),
      text(
        'startsAt',
        'Opens at',
        'The date, time and UTC offset, like 2027-01-28T09:00:00+01:00 (Prague is +01:00 in winter and +02:00 in summer). The countdown runs to this, and the year shown on the site comes from it.'
      ),
      text('endsOn', 'Last day', 'Like 2027-01-31.'),
      text('timeZone', 'Time zone', 'The dates on the site are shown in this time zone, like Europe/Prague.'),
      text('siteUrl', 'Website address', 'Used in emails and the sitemap.'),
      text('contactEmail', 'Contact email', 'Shown across the site and in the FAQs.'),
      group('mymun', 'myMUN', [
        number('conferenceId', 'Conference ID', 'The number in this year’s myMUN API URL. The stats on /about are worked out from it.'),
        text('pageUrl', 'Conference page'),
      ]),
      group('social', 'Social media', [text('facebook', 'Facebook'), text('instagram', 'Instagram'), text('linkedin', 'LinkedIn')]),
      text('beholdFeedId', 'Instagram feed ID', 'The feed under Latest News on the home page, from the Behold dashboard.'),
      group('stats', 'Numbers on /about', [
        number('attendeesBeforeMymun', 'Attendees before myMUN', 'Added to the lifetime attendees, since 2018 wasn’t on myMUN.'),
        text('internationalDelegations', 'International delegations', 'Shown as it is, like 30+.'),
      ]),
      group('credits', 'Credits', [
        {
          kind: 'textList',
          key: 'maintainedBy',
          label: 'Maintained by',
          itemLabel: 'Person',
          help: 'Shown in the site and email footers. Add yourself when you take over, and please don’t remove previous contributors: this is a multi-MUN-generational project :)',
        },
      ]),
    ]),
  },
  {
    id: 'pricing',
    title: 'Prices',
    description:
      'Shown on the site, and set as the amount on new payments. Changing a price doesn’t change what people were already charged: edit those on the Users page.',
    file: 'pricing.ts',
    root: root([price('delegate', 'Delegate'), price('chair', 'Chair'), price('supervisor', 'Supervisor')]),
  },
  {
    id: 'payment',
    title: 'Bank details',
    description: 'Shown on the Payment page and put into its QR codes. Check these carefully: a mistake sends people’s money to the wrong account.',
    file: 'payment.ts',
    root: root([
      text('recipient', 'Recipient name'),
      text('bank', 'Bank'),
      text('swift', 'SWIFT / BIC'),
      text('variableSymbol', 'Variable symbol'),
      bankAccount('czk', 'CZK account'),
      bankAccount('eur', 'EUR account'),
    ]),
  },
  {
    id: 'hero',
    title: 'Home page',
    description: 'The top of the home page.',
    file: 'hero.ts',
    root: root([
      text('tagline', 'Tagline', undefined, { multiline: true }),
      {
        kind: 'textList',
        key: 'images',
        label: 'Main photos',
        itemLabel: 'Photo',
        image: true,
        help: 'One is picked at random on each visit. These have to be files in public/, like /headers/photo.webp.',
      },
      {
        kind: 'textList',
        key: 'stackedImages',
        label: 'Smaller photos',
        itemLabel: 'Photo',
        image: true,
        help: 'One is picked at random on each visit. These have to be files in public/, like /headers/subheaders/photo.webp.',
      },
    ]),
  },
  {
    id: 'partners',
    title: 'Partners',
    description: 'The “Partnered with” logos on the home page. The section is hidden when there are none.',
    file: 'partners.ts',
    root: {
      kind: 'list',
      key: '',
      label: 'Partners',
      itemLabel: 'Partner',
      titleKey: 'alt',
      fields: [
        text('logo', 'Logo', 'A file in public/ starting with /, or a link starting with https://.', { image: true }),
        text('alt', 'Name', 'Read out by screen readers in place of the logo.'),
      ],
      newItem: () => ({ logo: '', alt: '' }),
    },
  },
  {
    id: 'team',
    title: 'Team',
    description: 'This year’s secretariat on /team, in the order they’re shown.',
    file: 'team.ts',
    root: {
      kind: 'list',
      key: '',
      label: 'Team members',
      itemLabel: 'Team member',
      titleKey: 'name',
      fields: [
        text('name', 'Name'),
        text('role', 'Role'),
        text('src', 'Photo', 'A file in public/people starting with /, or a link starting with https://. Use /logo.png until there’s a photo.', { image: true }),
        text('description', 'Bio', undefined, { multiline: true }),
      ],
      newItem: () => ({ src: '/logo.png', name: '', role: '', description: '' }),
    },
  },
  {
    id: 'venues',
    title: 'Venues',
    description: 'The venue cards on /this-year and /delegate-info.',
    file: 'venues.ts',
    root: {
      kind: 'list',
      key: '',
      label: 'Venues',
      itemLabel: 'Venue',
      titleKey: 'name',
      fields: [
        text('name', 'Name'),
        text('image', 'Photo', 'A file in public/ starting with /, or a link starting with https://.', { image: true }),
        text('description', 'Description', undefined, { multiline: true }),
      ],
      newItem: () => ({ name: '', image: '/logo.png', description: '' }),
    },
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: 'The schedule image on /this-year and /delegate-info.',
    file: 'schedule.ts',
    root: root([
      text('image', 'Schedule image', 'Has to be a file in public/, like /PLISMUN_SCHEDULE.png.', { image: true }),
      text('alt', 'Description', 'Read out by screen readers in place of the image.'),
      number('width', 'Width in pixels', 'The image’s real size, so the page doesn’t jump while it loads.'),
      number('height', 'Height in pixels'),
      text('background', 'Background photo', 'A file in public/ starting with /, or a link starting with https://.', { image: true }),
    ]),
  },
  {
    id: 'faq',
    title: 'FAQs',
    description: `In a question or answer you can write ${placeholderList}, and the current value is shown instead.`,
    file: 'faq.ts',
    root: root([
      faqList('general', 'General', 'The /faq page.'),
      faqList('delegate', 'Delegates', 'The bottom of /delegate-info.'),
      faqList('supervisor', 'Supervisors', 'The bottom of /supervisors.'),
    ]),
  },
  {
    id: 'about',
    title: 'About page',
    description: 'The text on /about.',
    file: 'about.ts',
    root: root([
      text('heading', 'Heading'),
      { kind: 'textList', key: 'paragraphs', label: 'Paragraphs', itemLabel: 'Paragraph', multiline: true },
    ]),
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'The sections of the Documents pages, and the limits on the Documents admin page.',
    file: 'documents.ts',
    root: root([
      {
        kind: 'list',
        key: 'groups',
        label: 'Sections',
        itemLabel: 'Section',
        titleKey: 'heading',
        help: 'In the order they’re shown. A section with no published documents is hidden on the public page.',
        fields: [
          text('heading', 'Heading'),
          text('blurb', 'Description', undefined, { multiline: true }),
          text(
            'id',
            'ID',
            'Lowercase letters, numbers and dashes. Documents are filed under it, so it can’t be changed or removed while the section has documents in it.',
            { placeholder: 'position-papers' }
          ),
        ],
        newItem: () => ({ id: '', heading: '', blurb: '' }),
      },
      number('maxSizeMb', 'Largest PDF, in MB'),
      number('titleMaxLength', 'Longest title, in characters'),
      number('descriptionMaxLength', 'Longest description, in characters'),
    ]),
  },
  {
    id: 'email',
    title: 'Emails',
    description:
      'The address emails are sent from and its mail server can only be changed in src/config/email.ts, because the email password is sent to that server when the site signs in.',
    file: 'email.ts',
    root: root([text('senderName', 'Sender name', 'Who emails appear to come from.')]),
  },
]

/** "Team member 4 › Name" for the field at ['3', 'name'], so a problem can be found on the page. */
export function describePath(field: Field, path: (string | number)[]): string[] {
  if (!path.length) return []
  const [first, ...rest] = path

  if (field.kind === 'group') {
    const child = field.fields.find((candidate) => candidate.key === first)
    return child ? [child.label, ...describePath(child, rest)] : []
  }
  if (field.kind === 'list') {
    const item = `${field.itemLabel} ${Number(first) + 1}`
    const child = field.fields.find((candidate) => candidate.key === rest[0])
    return child ? [item, child.label, ...describePath(child, rest.slice(1))] : [item]
  }
  if (field.kind === 'textList') return [`${field.itemLabel} ${Number(first) + 1}`]
  return []
}
