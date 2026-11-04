# Updating the site for a new year

Everything that changes from one conference to the next lives in this folder, so you shouldn't have to touch any components. Change a file, run `pnpm test` to catch typos, and deploy.

## The checklist

| What | Where |
| --- | --- |
| Conference dates | `conference.ts`: `startsAt` and `endsOn`. The countdown, the dates on the site and "PLISMUN'27" all come from these |
| myMUN page and conference ID | `conference.ts`: `mymun`. The stats on `/about` are calculated from the ID |
| "Returns for its tenth year" and the hero photos | `hero.ts`. Photos go in `public/headers` |
| Partners | `partners.ts` |
| Who's maintaining the site | `conference.ts`: `credits`. Please don't delete previous contributors. This is a multi-mun-generational project :) |
| Prices | `pricing.ts` |
| Bank details and the variable symbol | `payment.ts` |
| The secretariat and their bios | `team.ts`. Photos go in `public/people` |
| Venues | `venues.ts`. Photos go in `public/headers` |
| The schedule | `schedule.ts`. The image goes in `public/` |
| FAQs (including the walk to the venue) | `faq.ts` |
| The About page | `about.ts` |
| Sections of the Documents page | `documents.ts` |
| The address and sender of emails | `email.ts` |
| Links to social media and the contact address | `conference.ts` |

## Opening and closing things during the year

`stages.ts` says what's open: account creation, payments, and delegate, chair and supervisor applications. Change one and redeploy.

## What isn't here

Some things change every year but live in the database, so they can change without a deploy:

- **Committees** are in the `committees` table, added by hand. `scripts/db/sample-data.ts` shows the format, and the README has more on the database. The home page is built with them, so a change to a committee needs a redeploy to show there.
- **Documents** are managed from the Documents admin page. Replace last year's there rather than clearing out the table, or their PDFs stay in the Blob store.
- **Applications, people, payments and delegations** from last year need clearing out. See "Your job" in the README.

Secrets, and anything that differs between environments, are environment variables. See `.env.example`.
