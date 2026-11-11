import { getCachedCommittees } from "@/server/committees"
import CommitteesGrid from './committees-grid'
import type { Committee } from './types'

export const dynamic = 'force-static'

// Reads the database directly because this page is static: it's rendered while the site is being
// built, when the API routes aren't running. The committees come from Next's data cache, which saving on
// the Committees admin page clears, so a change made there shows straight away (see src/server/committees.ts).
export default async function CommitteesSection() {
    let committees: Committee[] = []

    try {
        committees = await getCachedCommittees()
    } catch (err) {
        // Outside a build, failing keeps the last good version of the page rather than caching an empty list
        if (process.env.NEXT_PHASE !== 'phase-production-build') throw err
        console.error('Error fetching static committees:', err)
    }

    return <CommitteesGrid committees={committees} />
}
