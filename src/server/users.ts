import 'server-only'
import { getTursoClient } from '@/server/db'
import { ApiError } from '@/server/with-api'

/** The ID of the user with this email. Answers the request with a 404 if there isn't one. */
export async function requireUserId(email: unknown): Promise<number> {
  const result = await getTursoClient().execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [typeof email === 'string' ? email : null],
  })
  if (!result.rows.length) throw new ApiError(404, 'User not found')
  return Number(result.rows[0].id)
}
