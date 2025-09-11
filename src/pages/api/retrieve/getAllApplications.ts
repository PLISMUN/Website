import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  try {
    const turso = getTursoClient()

    const applicationsResult = await turso.execute({
      sql: `
        SELECT 
          a.*, 
          c.name as committeeName,
          p.*,
          p.notes as userNotes,
          u.email as userEmail,
          pay.status as paymentStatus
        FROM applications a
        JOIN committees c ON a.committeeId = c.id
        JOIN people p ON a.userId = p.id
        JOIN users u ON a.userId = u.id
        JOIN payments pay ON a.userId = pay.id
      `
    });

    res.status(200).json({ applications: applicationsResult.rows });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}