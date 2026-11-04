
# Heya!  

This is the official repository for the PLISMUN Website.  

## Getting started

You need [Node.js](https://nodejs.org/) 22.12 or newer and [pnpm](https://pnpm.io/installation). Then:

```sh
cp .env.example .env
pnpm install
pnpm db:setup
pnpm dev
```

That gives you the whole site at <http://localhost:3000>, running on a local database file with made-up data. You can log in as `admin@example.com`, `delegate@example.com` or `supervisor@example.com`, all with the password `password123`. Nothing else is needed: emails are printed to the terminal instead of being sent. Only signing in with Google and uploading documents need [more setup](#environment-variables).

Delete `local.db` and run `pnpm db:setup` again to start over.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs the site locally |
| `pnpm test` | Runs the tests |
| `pnpm lint` | Checks the code for common mistakes |
| `pnpm typecheck` | Checks the types |
| `pnpm db:setup` | Creates the database tables, plus sample data for a local database |
| `pnpm db:migrate` | Brings an existing database up to date |

## Updating the site for a new year

Everything that changes each year is in [`src/config`](src/config/README.md), which has a checklist. You shouldn't have to touch any components.

## Project structure

```
src/
  config/       What changes every year: dates, prices, the team, the schedule, ... Start here
  app/          The pages. A file's position is its URL: app/about/page.tsx is /about
  pages/api/    The API routes. Every file in here is a public URL, so only routes go in here
  features/     The code for each part of the site, with the components, API calls and types together
    marketing/    The public pages: hero, countdown, team, venues, pricing, ...
    committees/   auth/   applications/   people/
    delegations/  documents/   payments/   supervisors/   users/
  components/
    ui/         Generic building blocks from shadcn: buttons, dialogs, ...
    layout/     The header, footer and portal sidebar
  server/       Code that only runs on the server: the database, auth, emails, withApi
  lib/          Small helpers used all over the place
scripts/db/     The database schema, migrations and sample data
tests/          The tests
```

Each feature that talks to the API has an `api.ts` with its typed API calls and a `types.ts`, so components never call `fetch` themselves. Files are named in `kebab-case`.

Where should something go?

- A new page: `src/app`, with its components in the matching folder in `src/features`.
- Something a person would change for next year's conference: `src/config`.
- Code that needs the database or a secret: `src/server`. Importing it from a browser component fails the build, on purpose.

### API routes

Every route uses `withApi`, which checks the method and who's calling before your code runs. A rejected request never reaches your handler, so you can't forget to check.

```ts
import { getTursoClient } from '@/server/db';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'admin' }, async ({ req, res, user }) => {
  // ...
  res.status(200).json({ ... });
});
```

`auth` is one of:

- `public`: anyone.
- `user`: anyone signed in. Take their identity from `user`, never from the request body.
- `admin`: signed-in admins.
- `adminOrSelf`: admins, and users whose own email is `req.body.email`. The route must only ever touch the user named by `req.body.email`.

Routes are `POST` unless you pass `method: 'GET'`. To answer with an error from anywhere inside a handler, throw `new ApiError(404, 'message')`. Anything else that's thrown becomes a 500.

## GIT Workflow

There are two repositories:  

1. **PLISMUN-ORG/Website** This is a private repository, the one you should push to.  
2. **PLISMUN/Website** This is a public repository. It automatically gets updated when we push into the private one, thanks to a GitHub Action on the private repository. So everything you commit ends up public: never commit secrets or real people's data.  

Each has `main` and `dev` branches. The `dev` branch is where you should push your changes. Once you are done with a feature, open a pull request to merge `dev` into `main`.  

Vercel automatically deploys the `main` branch of **PLISMUN/Website** to prod, and the `dev` branch to preview.  

All of this is to avoid paying Vercel for private repositories while still being able to work in an org.  

The org is owned by the afore mentioned PLISMUN account.  

Pull requests and pushes to `main` and `dev` run the types, lint and tests on GitHub Actions.

## Tech stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Vercel (hosting)
- Behold (Instagram feed widget)
- NextAuth
- TursoDB
- pnpm
- Vitest

For UI I have used:

- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailark](https://tailark.com/)

## Database

We use [TursoDB](https://turso.tech/) as our database. It is a LibSQL-esque database hosted in the cloud. We connect through their custom adapter/package. Locally, the same package reads a file instead.  

<img width="459" height="468" alt="db-diagram" src="https://github.com/user-attachments/assets/d6ab862b-0a8f-4770-a244-429342218c8e" />

[`scripts/db/schema.sql`](scripts/db/schema.sql) is the whole database as it should look today, with what each table is for. [`scripts/db/sample-data.ts`](scripts/db/sample-data.ts) shows what goes in it, including the format of a committee's roles and topics, which are JSON.

### Migrations

To change a table, update `schema.sql` and add a migration to `scripts/db/migrations`. Every migration runs each time, so it has to check what's already there and skip it.

The database commands use `TURSO_DATABASE_URL` from your environment or `.env`. They refuse to touch a remote database unless you add `--yes`, because it could be production:

```sh
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." pnpm db:migrate --yes
```

## Supervisors

Supervisors (teachers / delegation leaders) have their own application at `/user/supervisor/apply`, separate from the student flow, and a public guide at `/supervisors`. A supervisor either joins an existing delegation or requests a new one; admins create and link requested delegations from the Delegations admin page. Accepted supervisors of an existing delegation get the My Delegation page.

## Documents

The PDFs on `/documents` and `/delegate-info` are uploaded by admins from the Documents admin page, and stored in [Vercel Blob](https://vercel.com/docs/vercel-blob) because a Vercel deployment can't write to its own filesystem.

- **Setup:** in the Vercel project, go to Storage and create a Blob store with **Public** access, connected to the environments you use. This adds `BLOB_READ_WRITE_TOKEN`.
- **Adding a document:** on the Documents admin page, choose "New document" in a section, then upload its PDF. Until then it shows as "Unavailable". There are no defaults: documents live in the `documents` table, and a section with none is hidden. The sections themselves are in `src/config/documents.ts`.
- **Deleting a document** also deletes its PDF, so links to it stop working.
- **How an upload works:** the browser sends the file straight to Blob, which avoids the 4.5 MB limit on Vercel functions. `api/modify/uploadDocument` only hands out a token for a document that exists, then `api/modify/setDocument` records the upload in the `documents` table, which is what the public page reads.
- **Replacing a document** overwrites the same URL, so links that were already shared keep working. Someone who already opened the old file may see their cached copy for up to an hour.
- **Hobby plan limits:** 1 GB of storage and 10 GB of downloads a month. Going over locks the Blob store for 30 days, so keep an eye on usage around the conference.

## Environment variables

Only secrets, and what differs between environments or is read by a library, are environment variables. Everything else is in `src/config`. [`.env.example`](.env.example) has them all, and the site tells you what's missing when it starts.

| Variable | Needed for |
| --- | --- |
| `TURSO_DATABASE_URL` | Everything. `file:local.db` locally |
| `TURSO_AUTH_TOKEN` | A remote database |
| `AUTH_SECRET`, `NEXTAUTH_URL` | Signing in |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Signing in with Google |
| `EMAIL_PASSWORD` | Sending emails. Without it, emails are printed to the terminal outside of production |
| `BLOB_READ_WRITE_TOKEN` | Uploading documents |

## Your job

It looks like you're the next one to inherit this project. Good luck!  
I've tried to make the website take as much as possible from the database, so get that ready first.  

Things to do every year:

- Go through the checklist in [`src/config`](src/config/README.md)
- Update the committees in the database
- Replace last year's documents from the Documents admin page. Delete them there rather than clearing out the table, or their PDFs stay in the Blob store
- Get the databases ready: clear out last year's applications, people, payments and users, then run `pnpm db:setup --yes` against them

Things to implement:  

- [ ] Properly handle cacheing
- [ ] Reset password by email
- [X] Put new conference id in config
- [X] Pre-compute stats and make static on runtime
- [ ] Pre-compute committees and make static on runtime
- [X] Change paths to use routing files, dynamic routes, and route groups (project structure next.js app router)
- [ ] Add a url param to bypass application stages for testing
- [ ] Better instagram feed integration
- [ ] Create a skeleton UI for loading states
