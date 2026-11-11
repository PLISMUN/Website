import 'server-only'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getTursoClient } from '@/server/db'
import {
  SECTION_IDS,
  defaultSiteConfig,
  parseSection,
  type ConfigIssue,
  type SectionId,
  type SiteConfig,
} from '@/features/site-config/schema'
import type { SiteConfigSection } from '@/features/site-config/types'

// The site's settings live in the site_config table, one row per section of src/config that an admin
// has changed. A section without a row uses its default from src/config.
//
// Pages read the table through Next's data cache, so rendering a page normally doesn't touch the database.
// Saving on the Settings page clears that cache (revalidateTag in app/api/modify/setSiteConfig), and the
// pages are rebuilt on their next visit. API routes read the table fresh every time instead, so a price
// or a closed stage takes effect on the very next request.

/** The tag on everything cached from the site_config table. Revalidate it after changing the table. */
export const SITE_CONFIG_TAG = 'site-config'

// How long the cache is trusted without a save, so a change made to the table by hand (rather than on
// the Settings page, which clears the cache itself) still shows up eventually
const CACHE_SECONDS = 60 * 60

type SavedRow = { value: unknown; updatedAt: string; updatedBy: string }
// A plain object rather than a Map, so it can be kept in Next's data cache
type SavedRows = Partial<Record<SectionId, SavedRow>>

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** What was saved, with anything added to the defaults since then (at any depth) filled in. Lists are taken as saved. */
function withNewDefaults(fallback: unknown, saved: unknown): unknown {
  if (!isPlainObject(fallback) || !isPlainObject(saved)) return saved
  const merged: Record<string, unknown> = { ...fallback }
  for (const [key, value] of Object.entries(saved)) {
    merged[key] = key in fallback ? withNewDefaults(fallback[key], value) : value
  }
  return merged
}

async function readSavedRows(): Promise<SavedRows> {
  let rows
  try {
    rows = (await getTursoClient().execute('SELECT section, value, updatedAt, updatedBy FROM site_config')).rows
  } catch (err) {
    // pnpm db:migrate hasn't been run on this database yet, so nothing has been changed
    if (String(err).includes('no such table')) return {}
    throw err
  }

  const saved: SavedRows = {}
  for (const row of rows) {
    let value: unknown
    try {
      value = JSON.parse(String(row.value))
    } catch {
      value = undefined
    }
    saved[row.section as SectionId] = {
      value,
      updatedAt: String(row.updatedAt),
      updatedBy: String(row.updatedBy),
    }
  }
  return saved
}

// Only the rows are cached, not the finished settings, so the defaults always come from the code that's
// deployed now, even if the cache outlives a deployment
const readSavedRowsCached = unstable_cache(readSavedRows, ['site-config-rows'], {
  tags: [SITE_CONFIG_TAG],
  revalidate: CACHE_SECONDS,
})

/**
 * A saved section, checked again in case the shape of the settings has changed since it was saved.
 * Fields added to a section since then come from the defaults, and ones that were removed are dropped.
 */
function resolveSection<Id extends SectionId>(id: Id, saved: SavedRow | undefined) {
  const fallback = defaultSiteConfig[id]
  if (!saved) return { value: fallback, problem: null }

  const result = parseSection(id, withNewDefaults(fallback, saved.value))
  if (result.success) return { value: result.data, problem: null }

  const problem = result.issues.map((issue) => `${issue.path.join('.') || id}: ${issue.message}`).join('; ')
  console.error(`The saved ${id} settings aren't valid any more, so the defaults from src/config are used instead: ${problem}`)
  return { value: fallback, problem }
}

const resolveAll = (saved: SavedRows) =>
  Object.fromEntries(SECTION_IDS.map((id) => [id, resolveSection(id, saved[id]).value])) as SiteConfig

/**
 * The site's settings, for pages and layouts. Comes from Next's data cache, which saving on the Settings
 * page clears, so this normally doesn't touch the database. Read once per render.
 *
 * Not for API routes: use getLatestSiteConfig() there.
 *
 * If the database can't be reached while the site is being built, the build uses the defaults rather than
 * failing, and the pages pick up the real settings on the next save or within an hour. At any other time
 * the error is thrown, so a page that's being rebuilt keeps its last good version.
 */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  try {
    return resolveAll(await readSavedRowsCached())
  } catch (err) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') throw err
    console.error('Could not read the site settings, so this build uses the defaults from src/config:', err)
    return defaultSiteConfig
  }
})

/**
 * The site's settings straight from the database, for API routes and emails, so that what they enforce
 * or charge is never out of date.
 */
export async function getLatestSiteConfig(): Promise<SiteConfig> {
  return resolveAll(await readSavedRows())
}

/** For the Settings admin page: every section, its default, and who last changed it. */
export async function getSiteConfigSections(): Promise<Record<SectionId, SiteConfigSection>> {
  const saved = await readSavedRows()
  return Object.fromEntries(
    SECTION_IDS.map((id) => {
      const row = saved[id]
      const { value, problem } = resolveSection(id, row)
      return [
        id,
        {
          value,
          defaultValue: defaultSiteConfig[id],
          updatedAt: row?.updatedAt ?? null,
          updatedBy: row?.updatedBy ?? null,
          problem,
        },
      ]
    })
  ) as Record<SectionId, SiteConfigSection>
}

export class SiteConfigError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly issues: ConfigIssue[] = []
  ) {
    super(message)
  }
}

/** Checks that would need the database, which the schema can't do. */
async function checkAgainstDatabase<Id extends SectionId>(id: Id, value: SiteConfig[Id]) {
  if (id === 'documents') {
    // A document in a section that no longer exists would vanish from both the site and the admin page
    const groups = (value as SiteConfig['documents']).groups
    const inUse = await getTursoClient().execute('SELECT groupId, COUNT(*) AS count FROM documents GROUP BY groupId')
    const missing = inUse.rows.filter((row) => !groups.some((group) => group.id === row.groupId))
    if (missing.length) {
      throw new SiteConfigError(
        400,
        `These sections still have documents in them: ${missing.map((row) => `${row.groupId} (${row.count})`).join(', ')}. ` +
        'Delete or move those documents on the Documents page first, or keep the section’s ID as it was.',
        [{ path: ['groups'], message: 'A section that still has documents in it was removed or had its ID changed' }]
      )
    }
  }
}

/** The error for a section someone else saved or reset after the admin opened it. */
async function changedSinceError(id: SectionId) {
  const result = await getTursoClient().execute({
    sql: 'SELECT updatedBy FROM site_config WHERE section = ?',
    args: [id],
  })
  const who = result.rows.length ? ` by ${result.rows[0].updatedBy}` : ''
  return new SiteConfigError(409, `This section was changed${who} after you opened it. Reload the page to see the change, then make yours again.`)
}

/**
 * Saves an admin's change to a section.
 *
 * @param expectedUpdatedAt When the section was last saved as far as the admin knows (null if never),
 *   so two admins editing at once don't silently undo each other's changes.
 */
export async function saveSection(id: SectionId, value: unknown, expectedUpdatedAt: string | null, adminEmail: string) {
  const result = parseSection(id, value)
  if (!result.success) {
    throw new SiteConfigError(400, 'Some of these settings need fixing before they can be saved', result.issues)
  }

  await checkAgainstDatabase(id, result.data)

  // Only writes if the section is still as the admin last saw it. updatedAt is what tells saves apart,
  // so it has to move on even if two saves land in the same millisecond.
  const previous = expectedUpdatedAt === null ? Number.NaN : Date.parse(expectedUpdatedAt)
  const updatedAt = new Date(Number.isNaN(previous) ? Date.now() : Math.max(Date.now(), previous + 1)).toISOString()
  const json = JSON.stringify(result.data)
  const written = expectedUpdatedAt === null
    ? await getTursoClient().execute({
        sql: 'INSERT INTO site_config (section, value, updatedAt, updatedBy) VALUES (?, ?, ?, ?) ON CONFLICT (section) DO NOTHING',
        args: [id, json, updatedAt, adminEmail],
      })
    : await getTursoClient().execute({
        sql: 'UPDATE site_config SET value = ?, updatedAt = ?, updatedBy = ? WHERE section = ? AND updatedAt = ?',
        args: [json, updatedAt, adminEmail, id, expectedUpdatedAt],
      })
  if (!written.rowsAffected) throw await changedSinceError(id)
}

/** Goes back to the default from src/config for a section. */
export async function resetSection(id: SectionId, expectedUpdatedAt: string) {
  await checkAgainstDatabase(id, defaultSiteConfig[id])
  const deleted = await getTursoClient().execute({
    sql: 'DELETE FROM site_config WHERE section = ? AND updatedAt = ?',
    args: [id, expectedUpdatedAt],
  })
  if (!deleted.rowsAffected) throw await changedSinceError(id)
}
