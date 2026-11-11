import { z } from 'zod'
import type { ConfigIssue } from '@/features/site-config/schema'
import type { Committee, CommitteeTopic } from './types'

// What a committee has to look like to be saved from the Committees admin page. In the database, roles
// and topics are JSON strings (see Committee in types.ts); here they're lists, which is easier to edit.

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

const text = (max: number) =>
  z.string().trim().min(1, 'This can’t be empty').max(max, `Keep this to ${max} characters or fewer`)

const difficulty = z.string().refine((value) => DIFFICULTIES.includes(value), `Choose ${DIFFICULTIES.join(', ')}`)

export const committeeSchema = z.object({
  name: text(150),
  shorthand: text(20),
  description: text(3000),
  difficulty,
  icon: z
    .string()
    .trim()
    .regex(/^((\/|https?:\/\/)\S+)?$/i, 'Enter a file in public/ starting with /, a link starting with https://, or nothing'),
  roles: z
    .array(z.object({ role: text(100), difficulty }))
    .superRefine((roles, ctx) => {
      const seen = new Set<string>()
      roles.forEach((role, index) => {
        const key = role.role.trim().toLowerCase()
        if (seen.has(key)) ctx.addIssue({ code: 'custom', path: [index, 'role'], message: `${role.role.trim()} is in the list twice` })
        seen.add(key)
      })
    }),
  topics: z.array(z.object({ name: text(200), description: text(3000) })),
})

export type CommitteeInput = z.infer<typeof committeeSchema>

/** A committee as the Committees admin page edits it. */
export type CommitteeForAdmin = CommitteeInput & {
  id: number
  // Delegate and chair applications for it. A committee with any can't be deleted.
  applications: number
}

export function parseCommittee(value: unknown): { success: true; data: CommitteeInput } | { success: false; issues: ConfigIssue[] } {
  const result = committeeSchema.safeParse(value)
  if (result.success) return { success: true, data: result.data }
  return { success: false, issues: result.error.issues.map((issue) => ({ path: issue.path, message: issue.message })) }
}

const parseJson = (json: string): unknown => {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * A committee from the database, as lists. Copes with what was added by hand: roles written as plain
 * strings get the committee's difficulty, and topics come out in order (topic1, topic2, ... topic10).
 */
export function committeeFromRow(row: Committee): CommitteeInput {
  const roles = parseJson(row.roles)
  const topics = parseJson(row.topics)

  return {
    name: row.name,
    shorthand: row.shorthand,
    description: row.description,
    difficulty: row.difficulty,
    icon: row.icon ?? '',
    roles: Array.isArray(roles)
      ? roles.map((role) =>
          typeof role === 'string'
            ? { role, difficulty: row.difficulty }
            : { role: String(role?.role ?? ''), difficulty: String(role?.difficulty ?? row.difficulty) }
        )
      : [],
    topics:
      topics && typeof topics === 'object' && !Array.isArray(topics)
        ? Object.entries(topics as Record<string, CommitteeTopic>)
            .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
            .map(([, topic]) => ({ name: String(topic?.name ?? ''), description: String(topic?.description ?? '') }))
        : [],
  }
}

/** The JSON columns for a committee, in the format the rest of the site reads. */
export function committeeToColumns(committee: CommitteeInput) {
  return {
    roles: JSON.stringify(committee.roles),
    topics: JSON.stringify(Object.fromEntries(committee.topics.map((topic, index) => [`topic${index + 1}`, topic]))),
  }
}
