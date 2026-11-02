import { NextApiRequest, NextApiResponse } from 'next';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import authSupervisor from '@/lib/authSupervisor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;

  const delegations = await authSupervisor(req, res);
  if (!delegations) return;

  res.status(200).json({ delegations });
}
