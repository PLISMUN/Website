import { getSupervisedDelegations } from '@/server/auth';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'user' }, async ({ res, user }) => {
  const delegations = await getSupervisedDelegations(user.email);
  res.status(200).json({ delegations });
});
