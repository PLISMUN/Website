import { NextApiRequest, NextApiResponse } from 'next';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import authSupervisor from '@/lib/authSupervisor';

/**
 * Lists the delegations the signed-in user supervises (empty if they aren't an accepted delegation leader).
 *
 * @returns {NextApiResponse} res.status(200).json({ delegations: [{ id, name, shorthand, country }] })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;

  const delegations = await authSupervisor(req, res);
  if (!delegations) return;

  res.status(200).json({ delegations });
}
