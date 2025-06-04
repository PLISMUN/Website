# PLISMUN Public Website

This repository contains the source code for the official public website of PLISMUN. The site provides information about the conference, committees, partners, and other relevant resources for delegates and visitors.

## Features

- **Modern Next.js Frontend**: Built using [Next.js](https://nextjs.org/) for server-side rendering and static site generation.
- **TypeScript**: Ensures type safety and improved developer experience.
- **Chakra UI**: Utilizes [Chakra UI](https://chakra-ui.com/) for accessible and customizable React components.
- **Prisma ORM**: Database schema and seeding managed with [Prisma](https://www.prisma.io/).
- **SCSS Styling**: Custom styles written in SCSS for flexible and maintainable design.
- **Responsive Design**: Mobile-friendly layouts and components.
- **Sponsor & Partner Showcases**: Dedicated sections for sponsors and partners, with logos and links.
- **Social Media Integration**: Social icons and links using [Ionicons](https://ionic.io/ionicons).
- **Static Assets**: Images, PDFs, and other public resources in the `public/` directory.

## Project Structure

The website does not use routes, instead relying on traiditional directory structure.  

```
.
├── prisma/                # Prisma schema and seed scripts
├── public/                # Static assets (images, PDFs, etc.)
├── src/
│   ├── components/        # React components (Footer, Header, etc.)
│   ├── pages/             # Next.js routes (each file/folder = route)
│   │   ├── _app.tsx           # Custom App component
│   │   ├── _document.tsx
│   │   ├── index.tsx          # /
│   │   ├── 404.tsx            # /404
│   │   ├── 500.tsx            # /500
│   │   ├── about/
│   │   │   ├── index.tsx      # /about
│   │   │   ├── faq.tsx        # /about/faq
│   │   │   └── team/
│   │   │       ├── index.tsx        # /about/team
│   │   │       └── [id].tsx         # /about/team/:id
│   │   ├── admin/
│   │   │   └── applications.tsx     # /admin/applications
│   │   ├── api/                     # API routes (serverless functions)
│   │   │   ├── committees/
│   │   │   │   └── index.ts         # /api/committees
│   │   │   ├── user/
│   │   │   │   └── application/
│   │   │   │       ├── chair.ts     # /api/user/application/chair
│   │   │   │       ├── delegate.ts  # /api/user/application/delegate
│   │   │   │       ├── delegation.tsx # /api/user/application/delegation
│   │   │   │       ├── extra.ts     # /api/user/application/extra
│   │   │   │       └── index.ts     # /api/user/application
│   │   │   └── admin/
│   │   │       └── applications/
│   │   │           └── delegate.ts  # /api/admin/applications/delegate
│   │   ├── apply2025.tsx            # /apply2025
│   │   ├── committees/
│   │   │   ├── index.tsx            # /committees
│   │   │   └── [id].tsx             # /committees/:id
│   │   ├── conference/
│   │   │   ├── schedule.tsx         # /conference/schedule
│   │   │   └── venues.tsx           # /conference/venues
│   │   ├── partners.tsx             # /partners
│   │   ├── partners/
│   │   │   ├── arcidiecezni.tsx           # /partners/arcidiecezni
│   │   │   ├── youngtalentsfoundation.tsx # /partners/youngtalentsfoundation
│   │   │   └── zenwork.tsx                # /partners/zenwork
│   │   └── user/
│   │       ├── signup.tsx           # /user/signup
│   │       ├── login.tsx            # /user/login
│   │       ├── logout.tsx           # /user/logout
│   │       └── apply/
│   │           ├── index.tsx        # /user/apply
│   │           ├── chair.tsx        # /user/apply/chair
│   │           └── delegation.tsx   # /user/apply/delegation
│   ├── styles/            # SCSS stylesheets
│   │   ├── 0-settings/
│   │   ├── 1-tools/
│   │   ├── 2-base/
│   │   ├── 3-modules/
│   │   ├── 4-layout/
│   │   ├── components/
│   │   └── styles.scss
│   ├── utils/             # Utility functions and theme
│   │   ├── db.ts
│   │   ├── env.ts
│   │   ├── styles.ts
│   │   ├── templates.ts
│   │   └── ... (other utility files)
│   └── global.d.ts        # Global TypeScript definitions
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
└── README.md              # Project documentation
```

## How things work

### Deployment

Deployed using Vercel. In order to keep to the "hobby" plan while also using the github org, when a commit is made to the repository, a github action is triggered and mirrors the push onto a PLISMUN personal account, which is then used to deploy the site.

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in required values.

3. **Run the development server:**

   ```sh
   npm run dev
   ```

4. **Build for production:**

   ```sh
   npm run build
   npm start
   ```

5. **Database setup (if using Prisma):**

   ```sh
   npx prisma migrate dev
   npx prisma db seed
   ```

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build the application for production
- `npm start` – Start the production server
- `npx prisma ...` – Prisma database commands

---

For more details, see the code in [src/pages](src/pages), [src/components](src/components), and [prisma/schema.prisma](prisma/schema.prisma).