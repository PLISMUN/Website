import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getTursoClient } from '@/pages/api/components/dbAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      var isAdmin = false;

      // Master password check (for example for postman debuging) using query param. 
      // Ex http://localhost:3000/api/modify/acceptApplication?password=IncrediblelyStrongPassword123!
      try {
        if (req.query["password"] === process.env.INTERNAL_API_PASSWORD) {
          isAdmin = true;
          return;
        }
      } catch {
      }
    
      // NextAuth session retrieval
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user || !session.user.email) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if user being talked about is user making request
      try {
        if (req.body.email === session.user.email) {
          isAdmin = true;
          return;
        }
      } catch {}
    
      // check for admin against db with api endpoint
      // this, a time long ago, called /api/retrieve/getAdmin, but CORS bent me over and wasn't merciful with it's big fat stick, so now it's inline here
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

        isAdmin = (userResult.rows[0]?.isAdmin === "1") || (userResult.rows[0]?.isAdmin === 1);
      } catch (err) {
        return res.status(500).json({ message: 'Error verifying admin status: ' + err });
      }
    
      if (!isAdmin) {
        return res.status(403).json({ message: session.user.email + ' is not an admin' });
        // return res.status(403).json({ message: 'Forbidden' });
      }
}