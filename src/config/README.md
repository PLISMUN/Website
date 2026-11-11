# Updating the site for a new year

Everything that changes from one conference to the next lives in this folder, so you shouldn't have to touch any components.

There are two ways to change it:

- **From the Settings admin page** (`/user/admin/settings`, under Admin in the portal). Any admin can change these without a deploy, and the site shows a change as soon as it's saved.
- **In these files.** They're the defaults: a section nobody has changed on the Settings page reads from here. Change a file, run `pnpm test` to catch typos, and deploy. A section that *has* been changed on the Settings page ignores its file until someone presses **Reset to default** there.

The Settings page saves each section it changes as a row in the `site_config` table. The checks it runs before saving are in `src/features/site-config/schema.ts`, and `pnpm test` runs the same checks on these files.

Pages don't read that table on every visit: they're cached, and saving on the Settings page clears the cache. So change the settings there rather than editing the table by hand, which the site only notices within an hour.

## The checklist

| What | Settings page | File |
| --- | --- | --- |
| Conference dates | Conference | `conference.ts`: `startsAt` and `endsOn`. The countdown, the dates on the site and "PLISMUN'27" all come from these |
| myMUN page and conference ID | Conference | `conference.ts`: `mymun`. The stats on `/about` are calculated from the ID |
| "Returns for its tenth year" and the hero photos | Home page | `hero.ts`. Photos go in `public/headers` |
| Partners | Partners | `partners.ts` |
| Who's maintaining the site | Conference › Credits | `conference.ts`: `credits`. Please don't delete previous contributors. This is a multi-mun-generational project :) |
| Prices | Prices | `pricing.ts` |
| Bank details and the variable symbol | Bank details | `payment.ts` |
| The secretariat and their bios | Team | `team.ts`. Photos go in `public/people` |
| Venues | Venues | `venues.ts`. Photos go in `public/headers` |
| The schedule | Schedule | `schedule.ts`. The image goes in `public/` |
| FAQs (including the walk to the venue) | FAQs | `faq.ts` |
| The About page | About page | `about.ts` |
| Sections of the Documents page | Documents | `documents.ts` |
| The name emails are sent from | Emails | `email.ts` |
| The address and server emails are sent from | Not on the Settings page | `email.ts`: `emailServer` |
| Links to social media and the contact address | Conference | `conference.ts` |

Photos have to be uploaded with a deploy (into `public/`) before the Settings page can point at them. The hero photos and the schedule image have to be in `public/`; the others can also be a link to an image somewhere else.

In the FAQs, write `{contactEmail}`, `{delegate.czk}`, `{supervisor.eur}` and so on rather than typing in the address or a price, so the answers stay right when those change. The FAQs tab lists them all.

## Opening and closing things during the year

**What's open** on the Settings page (the defaults are in `stages.ts`): account creation, payments, and delegate, chair and supervisor applications.

Closing account creation also hides the login page. Admins who are still signed in can reach the Settings page to open it again. If nobody can, a developer can put the defaults from `stages.ts` back by running `DELETE FROM site_config WHERE section = 'stages'` against the database. The same works for any section that's gone wrong. Since that skips the Settings page, the site takes up to an hour to notice.

## What isn't here

Some things change every year but live in their own tables:

- **Committees** are in the `committees` table, added by hand. `scripts/db/sample-data.ts` shows the format, and the README has more on the database. The pages that show them pick up a change within an hour.
- **Documents** are managed from the Documents admin page. Replace last year's there rather than clearing out the table, or their PDFs stay in the Blob store.
- **Applications, people, payments and delegations** from last year need clearing out. See "Your job" in the README.

Secrets, and anything that differs between environments, are environment variables. See `.env.example`.
