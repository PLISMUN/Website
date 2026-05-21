import { getTursoClient } from '@/pages/api/components/dbAuth'
import CommitteesClient from './committees-display'

export const dynamic = 'force-static'

export default async function Committees() {
    let committees: any[] = []
    
    try {
        // I really really hate this approach as /app should not have any references to external services
        // but, I need this to be static, computed during compilation time
        // and our api routes are not active during build time
        // so the db has to be called directly

        // if anyone has any better ideas please please change this
        // this is a disgrace
        const turso = getTursoClient()
        const committeesResult = await turso.execute({
            sql: 'SELECT * FROM committees',
        })

        committees = committeesResult.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            shorthand: row.shorthand,
            description: row.description,
            difficulty: row.difficulty,
            roles: row.roles,
            topics: row.topics,
            icon: row.icon || '',
        }))
    } catch (err) {
        console.error('Error fetching static committees:', err)
    }

    return <CommitteesClient committees={committees} />
}
