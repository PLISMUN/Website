import 'server-only'
import { getServerSession } from 'next-auth/next'
import { authOptions, getAdminStatus } from '@/server/auth'
import { ApiError } from '@/server/with-api'

/**
 * withApi for the few routes that live in the App Router (src/app/api) rather than src/pages/api, because
 * they need something only the App Router has, like revalidateTag. Only signed-in admins get through.
 *
 *   export const POST = withAdminRoute(async ({ request, user }) => Response.json({ ... }))
 *
 * Throw an ApiError to answer with that status and message.
 */
export function withAdminRoute(handler: (context: { request: Request; user: { email: string } }) => Promise<Response>) {
  return async function route(request: Request): Promise<Response> {
    try {
      const session = await getServerSession(authOptions)
      const email = session?.user?.email
      if (!email) throw new ApiError(401, 'Unauthorized')

      const isAdmin = await getAdminStatus(email)
      if (isAdmin === null) throw new ApiError(404, 'User not found')
      if (!isAdmin) throw new ApiError(403, `${email} is not an admin`)

      return await handler({ request, user: { email } })
    } catch (err) {
      if (err instanceof ApiError) return Response.json({ message: err.message }, { status: err.status })
      console.error(`Error in ${new URL(request.url).pathname}:`, err)
      return Response.json({ message: (err instanceof Error && err.message) || 'Something went wrong' }, { status: 500 })
    }
  }
}
