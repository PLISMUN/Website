import { NextApiRequest, NextApiResponse } from 'next';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import sendEmail from '@/pages/api/internal/sendEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  await authAdmin(req, res);

  const { email, subject, body } = req.body;
  try {
    await sendEmail(email, subject, body);
    return res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
}