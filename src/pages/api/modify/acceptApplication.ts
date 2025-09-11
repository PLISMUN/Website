import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import sendEmail from '@/pages/api/internal/sendEmail';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
/**
 * Accepts application with provided application ID, rejecting all other applications of the user
 * 
 * @param {NextApiRequest[string]} req.body.id Application ID to accept
 * @param {NextApiRequest[string]} req.body.status Object mapping application IDs to their acceptance status (true for accept, false for reject)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  try {
    const turso = getTursoClient()

    for (const [id, status] of Object.entries(req.body)) {
        if (status === true) {
            const applicationDetails = await turso.execute({
            sql: `
              SELECT applications.userId, applications.role, applications.committeeId, users.email, committees.name AS committeeName
              FROM applications 
              JOIN users ON applications.userId = users.id 
              JOIN committees ON applications.committeeId = committees.id
              WHERE applications.id = ?
            `,
            args: [id],
            });

            if (applicationDetails.rows.length === 0) {
                return res.status(404).json({ message: 'Application User not found' });
            }

            const { userId, email, committeeName, role } = applicationDetails.rows[0];
            if (typeof email === 'string' && email) {
                await sendEmail(email, 'Application Accepted', `Congratulations! Your application (id ${id}) for the ${committeeName} committee as ${role} has been accepted.`);
            } else {
                return res.status(400).json({ message: 'Invalid email address' });
            }

            await turso.execute({
                sql: 'UPDATE applications SET status = "accepted" WHERE id = ?',
                args: [id],
            });

        } else if (status === false) {
            await turso.execute({
                sql: 'UPDATE applications SET status = "rejected" WHERE id = ?',
                args: [id],
            });
        }
    }
    
    res.status(200).json({ message: 'Applications status update successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}