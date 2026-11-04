import 'server-only'
import { getTursoClient } from '@/server/db'
import type { Committee } from '@/features/committees/types'

export async function getCommittees(): Promise<Committee[]> {
  const result = await getTursoClient().execute('SELECT * FROM committees')

  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    shorthand: String(row.shorthand),
    description: String(row.description),
    difficulty: String(row.difficulty),
    roles: String(row.roles),
    topics: String(row.topics),
    icon: row.icon ? String(row.icon) : '',
  }))
}
