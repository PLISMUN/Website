// pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { getTursoClient } from '@/pages/api/components/dbAuth';

//TODO validate input data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password, isGoogleUser } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server error: Missing env variables' });
  }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email) ||
    email.length > 100) {
    return res.status(400).json({ message: 'Invalid email format' });
}
if (typeof email !== 'string' || email.length > 100) {
    return res.status(400).json({ message: 'Email must be 100 characters or fewer' });
}

if (typeof password !== 'string' || password.length < 8 || password.length > 100) {
    return res.status(400).json({ message: 'Password must be between 8 and 100 characters long' });
}

// Hash the password before storing
const hashedPassword = await bcrypt.hash(password, 10);

const isGoogleUserBool = Boolean(isGoogleUser)

  try {
    const turso = getTursoClient()

    await turso.execute({
      sql: 'INSERT INTO users (email, password, isGoogleUser) VALUES (?, ?, ?)',
      args: [email, hashedPassword, isGoogleUserBool],
    });
    
    res.status(200).json({ message: 'Signup successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
