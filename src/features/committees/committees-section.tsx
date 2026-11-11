import { getCommittees } from '@/server/committees'
import CommitteesGrid from './committees-grid'
import type { Committee } from './types'

export const dynamic = 'force-static'

// Reads the database directly because this page is static: it's rendered while the site is being
// built, when the API routes aren't running. It's rebuilt at most once an hour after that (see
// revalidate in app/layout.tsx), or sooner if a setting is saved, so a change to the committees shows within an hour.
export default async function CommitteesSection() {
    let committees: Committee[] = []

    try {
        committees = await getCommittees()
    } catch (err) {
        console.error('Error fetching static committees:', err)
    }

    return <CommitteesGrid committees={committees} />
}
