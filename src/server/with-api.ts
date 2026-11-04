import 'server-only'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions, getAdminStatus } from '@/server/auth'

/**
 * Who can call an endpoint:
 * - public:      anyone
 * - user:        anyone signed in. Take their identity from `user`, never from the request body
 * - admin:       signed-in admins
 * - adminOrSelf: admins, and users whose own email is req.body.email. Such an endpoint must only
 *                ever touch the user named by req.body.email
 */
export type ApiAuth = 'public' | 'user' | 'admin' | 'adminOrSelf'

type SignedInUser = { email: string }

type ApiContext<Auth extends ApiAuth> = {
  req: NextApiRequest
  res: NextApiResponse
  user: Auth extends 'public' ? null : SignedInUser
}

/** Throw this from anywhere inside a handler to answer with that status and message. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
  }
}

async function authorize(auth: ApiAuth, req: NextApiRequest, res: NextApiResponse): Promise<SignedInUser | null> {
  if (auth === 'public') return null

  const session = await getServerSession(req, res, authOptions)
  const email = session?.user?.email
  if (!email) throw new ApiError(401, 'Unauthorized')

  if (auth === 'user') return { email }
  if (auth === 'adminOrSelf' && req.body?.email === email) return { email }

  const isAdmin = await getAdminStatus(email)
  if (isAdmin === null) throw new ApiError(404, 'User not found')
  if (!isAdmin) throw new ApiError(403, `${email} is not an admin`)
  return { email }
}

/**
 * Wraps every API route. It checks the method and who's calling before the handler runs, so a handler
 * only ever runs for an allowed request, and turns anything the handler throws into an error response.
 *
 *   export default withApi({ auth: 'admin' }, async ({ req, res, user }) => {
 *     res.status(200).json({ ... })
 *   })
 */
export function withApi<Auth extends ApiAuth>(
  options: { auth: Auth; method?: 'GET' | 'POST' },
  handler: (context: ApiContext<Auth>) => Promise<unknown>
) {
  const method = options.method ?? 'POST'

  return async function route(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }

    try {
      const user = await authorize(options.auth, req, res)
      await handler({ req, res, user } as ApiContext<Auth>)
    } catch (err) {
      if (res.headersSent) {
        console.error(`Error after responding to ${req.url}:`, err)
      } else if (err instanceof ApiError) {
        res.status(err.status).json({ message: err.message })
      } else {
        console.error(`Error in ${req.url}:`, err)
        res.status(500).json({ message: (err instanceof Error && err.message) || 'Something went wrong' })
      }
    }
  }
}
