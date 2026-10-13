import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTursoClient } from '@/pages/api/components/dbAuth';

/**
 * Whether the signed-in user is an admin. Unlike authAdmin, this never sends a response,
 * so it can be used to widen access on endpoints that other users can also reach.
 * Identity always comes from the session, never from the request body.
 */
export default async function isSessionAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return false;

  const turso = getTursoClient()
  const result = await turso.execute({
    sql: 'SELECT isAdmin FROM users WHERE email = ?',
    args: [session.user.email],
  });

  const isAdmin = result.rows[0]?.isAdmin;
  return isAdmin === 1 || isAdmin === "1";
}
