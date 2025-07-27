import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';
/**
 * Accepts application with provided application ID, rejecting all other applications of the user
 * 
 * @param {NextApiRequest[string]} req.body.id Application ID to accept
 * @param {NextApiRequest[string]} req.body.status Object mapping application IDs to their acceptance status (true for accept, false for reject)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server error: Missing env variables' });
  }
  try {
    const turso = getTursoClient()

    for (const [id, status] of Object.entries(req.body)) {
        if (status === true) {
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