import 'server-only'
import { unstable_cache } from 'next/cache'
import { getTursoClient } from '@/server/db'
import { ApiError } from '@/server/with-api'
import type { Committee } from '@/features/committees/types'
import {
  committeeFromRow,
  committeeToColumns,
  parseCommittee,
  type CommitteeForAdmin,
} from '@/features/committees/schema'
import type { ConfigIssue } from '@/features/site-config/schema'

// Committees are managed from the Committees admin page. Pages read them through Next's data cache, and
// saving on that page clears it (revalidateTag in app/api/modify/setCommittee), so pages show a change
// straight away without reading the table on every visit. API routes read the table fresh.

/** The tag on the cached committees. Revalidate it after changing the committees table. */
export const COMMITTEES_TAG = 'committees'

const toCommittee = (row: Record<string, unknown>): Committee => ({
  id: Number(row.id),
  name: String(row.name),
  shorthand: String(row.shorthand),
  description: String(row.description),
  difficulty: String(row.difficulty),
  roles: String(row.roles),
  topics: String(row.topics),
  icon: row.icon ? String(row.icon) : '',
})

/** Every committee, oldest first, straight from the database. For API routes. */
export async function getCommittees(): Promise<Committee[]> {
  const result = await getTursoClient().execute('SELECT * FROM committees ORDER BY id')
  return result.rows.map((row) => toCommittee(row as Record<string, unknown>))
}

/**
 * Every committee, for pages. Comes from Next's data cache, which saving on the Committees admin page
 * clears. A change made to the table by hand shows within an hour.
 */
export const getCachedCommittees = unstable_cache(getCommittees, ['committees'], {
  tags: [COMMITTEES_TAG],
  revalidate: 60 * 60,
})

/** For the Committees admin page: every committee as lists, with how many applications each has. */
export async function getCommitteesForAdmin(): Promise<CommitteeForAdmin[]> {
  const [committees, counts] = await Promise.all([
    getCommittees(),
    getTursoClient().execute('SELECT committeeId, COUNT(*) AS count FROM applications GROUP BY committeeId'),
  ])
  const applications = new Map(counts.rows.map((row) => [Number(row.committeeId), Number(row.count)]))
  return committees.map((committee) => ({
    id: committee.id,
    ...committeeFromRow(committee),
    applications: applications.get(committee.id) ?? 0,
  }))
}

/** A refused change, with what to fix in the form. */
export class CommitteeError extends ApiError {
  constructor(
    status: number,
    message: string,
    readonly issues: ConfigIssue[] = []
  ) {
    super(status, message)
  }
}

function validate(value: unknown) {
  const result = parseCommittee(value)
  if (!result.success) throw new CommitteeError(400, 'Some of this needs fixing before it can be saved', result.issues)
  return result.data
}

// The name and shorthand are UNIQUE in the table
function explainDuplicate(err: unknown): never {
  const message = String(err)
  for (const field of ['name', 'shorthand'] as const) {
    if (message.includes('UNIQUE') && message.includes(`committees.${field}`)) {
      throw new CommitteeError(400, `Another committee already has this ${field}`, [{ path: [field], message: `Another committee already has this ${field}` }])
    }
  }
  throw err
}

/** Adds a committee. Returns its ID. */
export async function createCommittee(value: unknown): Promise<number> {
  const committee = validate(value)
  const { roles, topics } = committeeToColumns(committee)
  try {
    const result = await getTursoClient().execute({
      sql: 'INSERT INTO committees (name, shorthand, description, difficulty, roles, topics, icon) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
      args: [committee.name, committee.shorthand, committee.description, committee.difficulty, roles, topics, committee.icon],
    })
    return Number(result.rows[0].id)
  } catch (err) {
    explainDuplicate(err)
  }
}

/**
 * Changes a committee. Applications point at it by ID, so they follow a new name. An application for a
 * role that's renamed or removed keeps the role it was made for.
 */
export async function updateCommittee(id: number, value: unknown): Promise<void> {
  const committee = validate(value)
  const { roles, topics } = committeeToColumns(committee)
  let result
  try {
    result = await getTursoClient().execute({
      sql: 'UPDATE committees SET name = ?, shorthand = ?, description = ?, difficulty = ?, roles = ?, topics = ?, icon = ? WHERE id = ?',
      args: [committee.name, committee.shorthand, committee.description, committee.difficulty, roles, topics, committee.icon, id],
    })
  } catch (err) {
    explainDuplicate(err)
  }
  if (!result.rowsAffected) throw new CommitteeError(404, 'This committee no longer exists. Reload the page.')
}

/** Deletes a committee nobody has applied for. Applications are listed through their committee, so deleting one with applications would hide them. */
export async function deleteCommittee(id: number): Promise<void> {
  const applications = await getTursoClient().execute({
    sql: 'SELECT COUNT(*) AS count FROM applications WHERE committeeId = ?',
    args: [id],
  })
  const count = Number(applications.rows[0].count)
  if (count) {
    throw new CommitteeError(
      409,
      `${count} application${count === 1 ? ' is' : 's are'} for this committee, and deleting it would hide ${count === 1 ? 'it' : 'them'} from the admin pages. Change the committee instead of deleting it.`
    )
  }
  const result = await getTursoClient().execute({ sql: 'DELETE FROM committees WHERE id = ?', args: [id] })
  if (!result.rowsAffected) throw new CommitteeError(404, 'This committee no longer exists. Reload the page.')
}
