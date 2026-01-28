
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
- Get the databases ready (clear out and then seed)
- Update who is maintaing the site. Please don't delete credits of previous contributors. This is a multi-mun-generational project :).

Things to implement:  

- [ ] Properly handle cacheing
- [ ] Reset password by email
- [ ] Put new conference id in env
- [ ] Imrpove stats geting speeds
- [ ] Change paths to use routing files, dynamic routes, and route groups (project structure next.js app router)
- [ ] Add a url param to bypass application stages for testing
- [ ] Better instagram feed integration
  
## Project Structure

- `/app` - is the client side of the website. The files position in `/app` represents the URL path. For example, `/app/about/page.tsx` is the `/about` page.
- `/components` - Hosts most react components used in the website. Both reusable and page-specific components.
- `/pages/api` - API routes. These are serer-side only. The file position in `/pages/api` represents the URL path. For example, `/pages/api/committees.ts` is the `/api/committees` endpoint.  
