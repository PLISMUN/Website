import { revalidateTag } from 'next/cache'
import { isSectionId } from '@/features/site-config/schema'
import { resetSection, saveSection, SITE_CONFIG_TAG, SiteConfigError } from '@/server/site-config'
import { withAdminRoute } from '@/server/with-route'

// In the App Router rather than src/pages/api because only here can it clear the cached settings
// (revalidateTag), which is what makes a change show on the site straight away.

/**
 * Saves a section of the site's settings, or resets it to its default from src/config, then clears the
 * cached settings so every page shows the change on its next visit.
 *
 * @param body.action 'save' | 'reset'
 * @param body.section A key of sectionSchemas in src/features/site-config/schema.ts
 * @param body.value The whole section (save)
 * @param body.expectedUpdatedAt updatedAt of the section when the admin loaded it, or null if it was
 *   using its default. If it has changed since, nothing is saved.
 * @returns 200 { message }
 * @returns 400 { message, issues: { path, message }[] } if the section isn't valid
 * @returns 409 { message } if someone else changed the section first
 */
export const POST = withAdminRoute(async ({ request, user }) => {
  const body = await request.json().catch(() => null)
  const { action, section, value, expectedUpdatedAt } = body ?? {}

  if (!isSectionId(section)) {
    return Response.json({ message: 'Unknown section' }, { status: 400 })
  }
  if (expectedUpdatedAt !== null && typeof expectedUpdatedAt !== 'string') {
    return Response.json({ message: 'expectedUpdatedAt must be a string or null' }, { status: 400 })
  }

  try {
    if (action === 'save') {
      await saveSection(section, value, expectedUpdatedAt, user.email)
      revalidateTag(SITE_CONFIG_TAG)
      return Response.json({ message: 'Saved' })
    }
    if (action === 'reset') {
      if (expectedUpdatedAt === null) {
        return Response.json({ message: 'This section is already using its default' }, { status: 400 })
      }
      await resetSection(section, expectedUpdatedAt)
      revalidateTag(SITE_CONFIG_TAG)
      return Response.json({ message: 'Reset to the default' })
    }
    return Response.json({ message: 'Invalid action' }, { status: 400 })
  } catch (err) {
    if (err instanceof SiteConfigError) {
      return Response.json({ message: err.message, issues: err.issues }, { status: err.status })
    }
    throw err
  }
})
