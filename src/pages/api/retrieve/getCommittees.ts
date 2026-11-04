import { getCommittees } from '@/server/committees';
import { withApi } from '@/server/with-api';

export default withApi({ auth: 'public' }, async ({ res }) => {
  const committees = await getCommittees();
  // Cache for 12 hours in the browser, and 24 hours on the CDN
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  res.status(200).json(committees);
});
