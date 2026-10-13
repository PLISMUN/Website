import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTursoClient } from '@/pages/api/components/dbAuth';

export type SupervisedDelegation = {
  id: number
  name: string
  shorthand: string
  country: string
}

/**
 * Resolves the delegations the signed-in user supervises: delegations they hold an accepted
 * supervisor (delegation leader) application for.
 *
 * Identity always comes from the session, never from the request body.
 * Lives outside src/pages/api so it isn't exposed as a route.
 *
 * @returns The supervised delegations (possibly empty), or null if a response has already been sent.
 */
export default async function authSupervisor(req: NextApiRequest, res: NextApiResponse): Promise<SupervisedDelegation[] | null> {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.email) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }

  try {
    const turso = getTursoClient()
    const result = await turso.execute({
      sql: `
        SELECT DISTINCT d.id, d.name, d.shorthand, d.country
        FROM delegations d
        JOIN supervisors s ON s.delegation = d.name
        JOIN users u ON u.id = s.userId
        WHERE u.email = ? AND s.status = 'accepted'
        ORDER BY d.name
      `,
      args: [session.user.email],
    });

    return result.rows.map((row: any) => ({
      id: Number(row.id),
      name: row.name,
      shorthand: row.shorthand,
      country: row.country,
    }));
  } catch (err) {
    res.status(500).json({ message: 'Error verifying supervisor status: ' + err });
    return null;
  }
}
