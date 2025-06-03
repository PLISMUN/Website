// Prisma database connection

import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

const adapter = new PrismaLibSQL(libsql)

const IS_PROD = process.env.NODE_ENV === "production"

/**
 * Ensure that there's only a single Prisma instance in dev. This is detailed here:
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
declare global {
  // eslint-disable-next-line no-var
  var __globalPrisma__: PrismaClient
}

export let db: PrismaClient

if (IS_PROD) {
  db = new PrismaClient({ adapter })
} else {
  if (!global.__globalPrisma__) {
    global.__globalPrisma__ = new PrismaClient({ adapter })
  }

  db = global.__globalPrisma__
}
