import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;

  // Identity comes from the session, so this can't be used to find out who the admins are
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

    try {
    const turso = getTursoClient()

    const userResult = await turso.execute({
      sql: 'SELECT isAdmin FROM users WHERE email = ?',
      args: [session.user.email],
    });

    if (!userResult.rows.length) {
      console.error("User not found")
      return res.status(404).json({ message: 'User not found' });
    }
    
    const personInfo = userResult.rows.map((row: any) => ({
        isAdmin: row.isAdmin?.toString() || '',
    }));
    res.status(200).json(personInfo);
  } catch (err: any) {
    console.error('Error getting admin:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}