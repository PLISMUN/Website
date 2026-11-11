import { apiPost } from '@/lib/api-client'
import type { CommitteeForAdmin, CommitteeInput } from './schema'
import type { Committee } from './types'

export const getCommittees = () =>
  apiPost<Committee[]>('/api/retrieve/getCommittees', 'Failed to fetch committees')

/** Admins: every committee with its roles and topics as lists, and how many applications each has. */
export const getCommitteesForAdmin = () =>
  apiPost<{ committees: CommitteeForAdmin[] }>('/api/retrieve/getCommitteesAdmin', 'Failed to load the committees')

/** Admins: throws an ApiRequestError whose data.issues says what to fix if the committee isn't valid. */
export const setCommittee = (
  change: { action: 'create'; committee: CommitteeInput } | { action: 'update'; id: number; committee: CommitteeInput } | { action: 'delete'; id: number }
) => apiPost<{ message: string; id: number }>('/api/modify/setCommittee', 'Failed to save the committee', change)
