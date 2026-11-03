
# Heya!  

This is the official repository for the PLISMUN Website.  

## GIT Workflow

There are two repositories:  

1. **PLISMUN-ORG/Website** This is a private repository, the one you should push to.  
2. **PLISMUN/Website** This is a public repository. It automatically gets updated when we push into the private one, thanks to a GitHub Action on the private repository.  

Each has `main` and `dev` branches. The `dev` branch is where you should push your changes. Once you are done with a feature, open a pull request to merge `dev` into `main`.  

Vercel automatically deploys the `main` branch of **PLISMUN/Website** to prod, and the `dev` branch to preview.  

All of this is to avoid paying Vercel for private repositories while still being able to work in an org.  

The org is owned by the afore mentioned PLISMUN account.  

## Tech stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Vercel (hosting)
- Behold (Instagram feed widget)
- NextAuth
- TursoDB

For UI I have used:

- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailark](https://tailark.com/)

## Database

We use [TursoDB](https://turso.tech/) as our database. It is a LibSQL-esque database hosted in the cloud. We connect through their custom adapter/package.  

<img width="459" height="468" alt="db-diagram" src="https://github.com/user-attachments/assets/d6ab862b-0a8f-4770-a244-429342218c8e" />


Here are some useful examples for each table:  

```sql
SELECT * FROM users LIMIT 1;  -- Do not interfere (other than making someone admin). Automatically managed
    [
    {
        "id": 1,
        "email": "pupil.tomas.stoklasek@parklane-is.com",
        "password": "...",
        "isGoogleUser": 1,
        "isAdmin": 1
    }
    ]
SELECT * FROM applications LIMIT 1;  -- Do not interfere. Automatically managed
    [
    {
        "id": 1,
        "type": "delegate",
        "userId": 1,
        "committeeId": 1,
        "role": "Laos",
        "notes": "waf",
        "status": "rejected"
    }
    ]
SELECT * FROM supervisors LIMIT 1;  -- Do not interfere. Automatically managed
    [
    {
        "id": 9991,
        "userId": 1,
        "delegation": "prague international school",
        "status": "rejected"
    }
    ]
SELECT * FROM payments LIMIT 1;  -- Do not interfere. Automatically managed
    [
    {
        "id": 1,
        "valueCzk": 1350,
        "valueEur": 55,
        "status": "Pending"
    }
    ]
SELECT * FROM people LIMIT 1;  -- Do not interfere. Automatically managed
    [
    {
        "id": 1,
        "name": "...",
        "birth": "2003-05-31",
        "nationality": "Aruba",
        "delegation": "Prague International School",
        "diet": "None",
        "notes": "I am succesfull"
    }
    ]
SELECT * FROM delegations LIMIT 1;
    [
    {
        "id": 1,
        "name": "Prague International School",
        "shorthand": "PIS",
        "country": "Czech Republic",
        "adminId": "1",
        "notes": null
    }
    ]
SELECT * FROM committees LIMIT 1;
    [
    {
        "id": 1,
        "name": "World Health Organisation (WHO)",
        "shorthand": "WHO",
        "description": "A specialised agency of the United Nations responsible for the protection of international public health. They coordinate global responses to outbreaks and develop health guidelines for countries to follow.",
        "difficulty": "Beginner",
        "roles": "[{\"role\":\"France\",\"difficulty\":\"Beginner\"},{\"role\":\"Sweden\",\"difficulty\":\"Beginner\"},{\"role\":\"Canada\",\"difficulty\":\"Beginner\"},{\"role\":\"Germany\",\"difficulty\":\"Beginner\"},{\"role\":\"Spain\",\"difficulty\":\"Beginner\"},{\"role\":\"Italy\",\"difficulty\":\"Beginner\"},{\"role\":\"Netherlands\",\"difficulty\":\"Beginner\"},{\"role\":\"Laos\",\"difficulty\":\"Beginner\"},{\"role\":\"Switzerland\",\"difficulty\":\"Beginner\"},{\"role\":\"Norway\",\"difficulty\":\"Beginner\"},{\"role\":\"Syria\",\"difficulty\":\"Intermediate\"},{\"role\":\"Philippines\",\"difficulty\":\"Intermediate\"},{\"role\":\"Venezuela\",\"difficulty\":\"Intermediate\"},{\"role\":\"Kenya\",\"difficulty\":\"Intermediate\"},{\"role\":\"Saudi Arabia\",\"difficulty\":\"Intermediate\"},{\"role\":\"Australia\",\"difficulty\":\"Intermediate\"},{\"role\":\"South Africa\",\"difficulty\":\"Intermediate\"},{\"role\":\"Colombia\",\"difficulty\":\"Intermediate\"},{\"role\":\"Monaco\",\"difficulty\":\"Intermediate\"},{\"role\":\"Cambodia\",\"difficulty\":\"Intermediate\"},{\"role\":\"Nigeria\",\"difficulty\":\"Intermediate\"},{\"role\":\"South Korea\",\"difficulty\":\"Intermediate\"},{\"role\":\"Pakistan\",\"difficulty\":\"Intermediate\"},{\"role\":\"Iraq\",\"difficulty\":\"Intermediate\"},{\"role\":\"Indonesia\",\"difficulty\":\"Intermediate\"},{\"role\":\"USA\",\"difficulty\":\"Advanced\"},{\"role\":\"Russia\",\"difficulty\":\"Advanced\"},{\"role\":\"UK\",\"difficulty\":\"Advanced\"},{\"role\":\"Brazil\",\"difficulty\":\"Advanced\"},{\"role\":\"Afghanistan\",\"difficulty\":\"Advanced\"},{\"role\":\"Iran\",\"difficulty\":\"Advanced\"},{\"role\":\"India\",\"difficulty\":\"Advanced\"},{\"role\":\"Mexico\",\"difficulty\":\"Advanced\"},{\"role\":\"China\",\"difficulty\":\"Advanced\"},{\"role\":\"Singapore\",\"difficulty\":\"Advanced\"}]",
        "topics": "{\"topic1\":{\"name\":\"Reevaluating rehabilitation centres in order to protect vulnerable groups heavily impacted by illicit substances\",\"description\":\"Many rehabilitation centres worldwide...\"},\"topic2\":{\"name\":\"Considering methods of mitigating the dangerous impacts of gambling on mental wellbeing\",\"description\":\"In recent years gambling...\"}}",
        "icon": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2"
    }
    ]
```

### Migrations

Existing databases need these run once (send a request with the `INTERNAL_API_PASSWORD` as the `password` URL param, like `seedDb`). Each is safe to run more than once.

- `api/utils/migratePaymentStatus` - payments.status becomes a boolean
- `api/utils/migrateSupervisorApplications` - required by the supervisor application flow: people.delegation becomes nullable (a supervisor of a new delegation has none until an admin creates it) and supervisors gains `country` and `students`
- `api/utils/migrateDocuments` - required by the Documents admin page: adds the `documents` table

## Supervisors

Supervisors (teachers / delegation leaders) have their own application at `/user/supervisor/apply`, separate from the student flow, and a public guide at `/supervisors`. A supervisor either joins an existing delegation or requests a new one; admins create and link requested delegations from the Delegations admin page. Accepted supervisors of an existing delegation get the My Delegation page.

## Documents

The PDFs on `/documents` and `/delegate-info` are uploaded by admins from the Documents admin page, and stored in [Vercel Blob](https://vercel.com/docs/vercel-blob) because a Vercel deployment can't write to its own filesystem.

- **Setup:** in the Vercel project, go to Storage and create a Blob store with **Public** access, connected to the environments you use. This adds `BLOB_READ_WRITE_TOKEN`. Then run the `migrateDocuments` migration.
- **Adding a document:** on the Documents admin page, choose "New document" in a section, then upload its PDF. Until then it shows as "Unavailable". There are no defaults: documents live in the `documents` table, and a section with none is hidden. The sections themselves are in `src/config/documents.ts`.
- **Deleting a document** also deletes its PDF, so links to it stop working.
- **How an upload works:** the browser sends the file straight to Blob, which avoids the 4.5 MB limit on Vercel functions. `api/modify/uploadDocument` only hands out a token for a document that exists, then `api/modify/setDocument` records the upload in the `documents` table, which is what the public page reads.
- **Replacing a document** overwrites the same URL, so links that were already shared keep working. Someone who already opened the old file may see their cached copy for up to an hour.
- **Hobby plan limits:** 1 GB of storage and 10 GB of downloads a month. Going over locks the Blob store for 30 days, so keep an eye on usage around the conference.

## Environment Variables

```env
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

EMAIL="plismun@parklane-is.com"
EMAIL_PASSWORD=
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465

NEXT_PUBLIC_STAGE_ACCOUNT_CREATION="true"
NEXT_PUBLIC_STAGE_PAYMENTS_ACCEPTED="true"
NEXT_PUBLIC_STAGE_CHAIR="true"
NEXT_PUBLIC_STAGE_DELEGATE="true"
NEXT_PUBLIC_STAGE_SUPERVISOR="true"

NEXT_PUBLIC_PRICE_CZK=1350
NEXT_PUBLIC_PRICE_EUR=55

NEXT_PUBLIC_PRICE_CZK_CHAIR=750
NEXT_PUBLIC_PRICE_EUR_CHAIR=32

NEXT_PUBLIC_PRICE_CZK_SUPERVISOR=700
NEXT_PUBLIC_PRICE_EUR_SUPERVISOR=30

NEXTAUTH_URL=
INTERNAL_API_PASSWORD=

BLOB_READ_WRITE_TOKEN=
```

## Your job

It looks like you're the next one to inherit this project. Good luck!  
I've tried to make the website take as much as possible from the database, so seed that first (send a request to `api/utils/seedDb` with the `INTERNAL_API_PASSWORD` as a URL param with the key `password`).  

You can start the local development server with first installing all required dependencies with `npm i`, populating the .env, getting a DB ready, and then running `npm run dev`. It should be straightforward from there.  

Things to do every year:

- Update the content (committees, prices, etc.) in the database & env vars  
- Update partners (hero) in the code
- Update secretariat members & their pictures (`/about` and in the `public/people` dir)  
- Update Social Event and schedule (`/this-year`)
- Replace last year's documents from the Documents admin page. Delete them there rather than clearing out the table, or their PDFs stay in the Blob store
- Get the databases ready (clear out and then seed)
- Update who is maintaing the site. Please don't delete credits of previous contributors. This is a multi-mun-generational project :).

Things to implement:  

- [ ] Properly handle cacheing
- [ ] Reset password by email
- [ ] Put new conference id in env
- [X] Pre-compute stats and make static on runtime
- [ ] Pre-compute committees and make static on runtime
- [X] Change paths to use routing files, dynamic routes, and route groups (project structure next.js app router)
- [ ] Add a url param to bypass application stages for testing
- [ ] Better instagram feed integration
- [ ] Create a skeleton UI for loading states
  
## Project Structure

- `/app` - is the client side of the website. The files position in `/app` represents the URL path. For example, `/app/about/page.tsx` is the `/about` page.
- `/components` - Hosts most react components used in the website. Both reusable and page-specific components.
- `/pages/api` - API routes. These are serer-side only. The file position in `/pages/api` represents the URL path. For example, `/pages/api/committees.ts` is the `/api/committees` endpoint.  
