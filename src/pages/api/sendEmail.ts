import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

const { email, title, body }: { email: string; title: string; body: string } = req.body;
    if (!email || !title || !body) {
        return res.status(400).json({ message: 'Email, title, and body are required' });
    }
}