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

    const applicationsSupervisorResult = await turso.execute({
      sql: `
        SELECT
          a.id,
          a.userId,
          a.delegation AS committeeName,
          'supervisor' AS type,
          a.status,
          NULL AS committeeId,
          'supervisor' AS role,
          NULL AS notes,
          u.email AS userEmail,
          p.name AS name,
          p.birth AS birth,
          p.nationality AS nationality,
          a.delegation AS delegation,
          p.notes AS userNotes,
          pay.status AS paymentStatus
        FROM supervisors a
        JOIN people p ON a.userId = p.id
        JOIN users u ON a.userId = u.id
        JOIN payments pay ON a.userId = pay.id
      `,
    });

    const combinedApplications = [
      ...applicationsResult.rows,
      ...applicationsSupervisorResult.rows,
    ];

    res.status(200).json({ applications:combinedApplications });
  } catch (err: any) {
    console.error('Error retrieving applications:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}