import { getSiteConfigSections } from '@/server/site-config';
import { withApi } from '@/server/with-api';

/**
 * For the Settings admin page: every section of the site's settings with its default from
 * src/config, and who changed it last.
 *
 * @returns 200 { sections: Record<SectionId, SiteConfigSection> }
 */
export default withApi({ auth: 'admin' }, async ({ res }) => {
  res.status(200).json({ sections: await getSiteConfigSections() });
});
