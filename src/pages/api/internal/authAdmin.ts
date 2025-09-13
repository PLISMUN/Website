import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

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
      try {
        const resAdmin = await fetch(`${process.env.NEXTAUTH_URL}/api/retrieve/getAdmin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        })
        if (resAdmin.ok) {
          const result = await resAdmin.json()
          isAdmin = result[0]?.isAdmin === "1"
        } else {
          isAdmin = false
        }
      } catch (err) {
        return res.status(500).json({ message: 'Error verifying admin status: ' + err });
      }
    
      if (!isAdmin) {
        return res.status(403).json({ message: session.user.email + ' is not an admin' });
        // return res.status(403).json({ message: 'Forbidden' });
      }
}