import { getCommitteesForAdmin } from '@/server/committees';
import { withApi } from '@/server/with-api';

/**
 * For the Committees admin page: every committee with its roles and topics as lists, and how many
 * applications each has.
 *
 * @returns 200 { committees: CommitteeForAdmin[] }
 */
export default withApi({ auth: 'admin' }, async ({ res }) => {
  res.status(200).json({ committees: await getCommitteesForAdmin() });
});
