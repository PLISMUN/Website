export type Committee = {
  id: number
  name: string
  shorthand: string
  description: string
  difficulty: string
  // JSON: CommitteeRole[]
  roles: string
  // JSON: Record<string, CommitteeTopic>
  topics: string
  icon: string
}

export type CommitteeRole = {
  role: string
  difficulty?: string
}

export type CommitteeTopic = {
  name: string
  description: string
}

/** The roles of a committee. Empty if they can't be read, so one bad row can't break a whole form. */
export function parseCommitteeRoles(roles: string): CommitteeRole[] {
  try {
    const parsed: unknown = JSON.parse(roles)
    if (!Array.isArray(parsed)) return []
    return parsed.map((role) => (typeof role === 'string' ? { role } : role))
  } catch {
    return []
  }
}
