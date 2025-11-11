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
          console.log("master authentication")
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
          console.log("primary user authnetication")
          return;
        }
      } catch {}
    
      // check for admin against db with api endpoint
      try {
        console.log("email: " + session.user.email)
        const resAdmin = await fetch(`${process.env.NEXTAUTH_URL}/api/retrieve/getAdmin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        })
        if (resAdmin.ok) {
          const result = await resAdmin.json()
          isAdmin = (result[0]?.isAdmin === "1") || (result[0]?.isAdmin === 1)
          console.log("admin user authentication")
        } else {
            console.error("resAdmin not ok: " + resAdmin.status);
            try {
              console.error('resAdmin metadata:', {
                ok: resAdmin.ok,
                status: resAdmin.status,
                statusText: resAdmin.statusText,
                url: (resAdmin as any).url ?? 'n/a',
                redirected: (resAdmin as any).redirected ?? 'n/a',
                type: (resAdmin as any).type ?? 'n/a',
                bodyUsed: (resAdmin as any).bodyUsed ?? 'n/a',
              });

              const headers: Record<string, string> = {};
              resAdmin.headers.forEach((value, key) => (headers[key] = value));
              console.error('resAdmin headers:', headers);

              try {
                const jsonBody = await resAdmin.clone().json();
                console.error('resAdmin json body:', jsonBody);
              } catch (jsonErr) {
                try {
                  const textBody = await resAdmin.clone().text();
                  console.error('resAdmin text body:', textBody);
                } catch (textErr) {
                  console.error('resAdmin body could not be read as json or text', { jsonErr, textErr });
                }
              }
            } catch (logErr) {
              console.error('Error while logging resAdmin details:', logErr);
            }
          return res.status(500).json({ message: 'resAdmin not ok'})
        }
      } catch (err) {
        return res.status(500).json({ message: 'Error verifying admin status: ' + err });
      }
    
      if (!isAdmin) {
        return res.status(403).json({ message: session.user.email + ' is not an admin' });
        // return res.status(403).json({ message: 'Forbidden' });
      }
}