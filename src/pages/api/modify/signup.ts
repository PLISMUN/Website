import bcrypt from 'bcryptjs';
import { getTursoClient } from '@/server/db';
import { sendEmail } from '@/server/email';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'public' }, async ({ req, res }) => {
  const { email, password, isGoogleUser } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 100) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (typeof email !== 'string' || email.length > 100) {
    return res.status(400).json({ message: 'Email must be 100 characters or fewer' });
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 100) {
    return res.status(400).json({ message: 'Password must be between 8 and 100 characters long' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await getTursoClient().execute({
    sql: 'INSERT INTO users (email, password, isGoogleUser) VALUES (?, ?, ?)',
    args: [email, hashedPassword, Boolean(isGoogleUser)],
  });

  await sendEmail(email, 'Welcome to PLISMUN!', `Thank you for signing up! Your account has been created successfully.`);
  res.status(200).json({ message: 'Signup successful' });
});
