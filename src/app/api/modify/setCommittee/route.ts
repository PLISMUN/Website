import { revalidateTag } from 'next/cache'
import { COMMITTEES_TAG, CommitteeError, createCommittee, deleteCommittee, updateCommittee } from '@/server/committees'
import { withAdminRoute } from '@/server/with-route'

// In the App Router rather than src/pages/api because only here can it clear the cached committees
// (revalidateTag), which is what makes a change show on the site straight away.

/**
 * Creates, changes or deletes a committee, then clears the cached committees so the pages that list
 * them show the change on their next visit.
 *
 * @param body.action 'create' | 'update' | 'delete'
 * @param body.id The committee (update and delete)
 * @param body.committee The whole committee, as CommitteeInput in src/features/committees/schema.ts (create and update)
 * @returns 200 { message, id }
 * @returns 400 { message, issues: { path, message }[] } if the committee isn't valid
 * @returns 409 { message } if a committee with applications is deleted
 */
export const POST = withAdminRoute(async ({ request }) => {
  const body = await request.json().catch(() => null)
  const { action, id, committee } = body ?? {}

  try {
    if (action === 'create') {
      const newId = await createCommittee(committee)
      revalidateTag(COMMITTEES_TAG)
      return Response.json({ message: 'Committee created', id: newId })
    }

    if (action !== 'update' && action !== 'delete') {
      return Response.json({ message: 'Invalid action' }, { status: 400 })
    }
    if (!Number.isInteger(id)) {
      return Response.json({ message: 'Invalid committee ID' }, { status: 400 })
    }

    if (action === 'update') await updateCommittee(id, committee)
    else await deleteCommittee(id)
    revalidateTag(COMMITTEES_TAG)
    return Response.json({ message: action === 'update' ? 'Committee saved' : 'Committee deleted', id })
  } catch (err) {
    if (err instanceof CommitteeError) {
      return Response.json({ message: err.message, issues: err.issues }, { status: err.status })
    }
    throw err
  }
})
