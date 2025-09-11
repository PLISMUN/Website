import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

/**
 * Creates a new application for the user.
 * 
 * @param {NextApiRequest[string]} req.body.email User's email
 * @param {NextApiRequest[string]} req.body.type Type of application (e.g., "delegate", "chair")
 * @param {NextApiRequest[string]} req.body.committee Committee ID the user is applying to
 * @param {NextApiRequest[string]} req.body.role Role the user is applying for
 * @param {NextApiRequest[string]} req.body.notes Additional notes for the application
 * @returns {NextApiResponse} res.status(200).json({ message: 'Signup successful', applicationId: <int> })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);
  
  const { email, type, committee, role, notes } = req.body;

  try {
    const turso = getTursoClient();

    const userResult = await turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });

    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    const applicationResult = await turso.execute({
      sql: 'INSERT INTO applications (type, userId, committeeId, role, notes) VALUES (?, ?, ?, ?, ?) RETURNING id',
      args: [type, userId, committee, role, notes],
    });

    const applicationId = applicationResult.rows[0].id;

    res.status(200).json({ message: 'Signup successful', applicationId });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}