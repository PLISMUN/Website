import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import sendEmail from '@/pages/api/internal/sendEmail';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);

  const { email, password, isGoogleUser } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
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

    await sendEmail(email, 'Welcome to PLISMUN!', `Thank you for signing up! Your account has been created successfully.`);
    res.status(200).json({ message: 'Signup successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}
