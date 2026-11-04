import { apiPost } from '@/lib/api-client'
import type { PersonInfo } from './types'

/** The user's saved details: one row, or none if they haven't filled them in yet. */
export const getPeopleInfo = (email: string) =>
  apiPost<PersonInfo[]>('/api/retrieve/getPeopleInfo', 'Failed to fetch your details', { email })

export const setPeopleInfo = (info: PersonInfo & { email: string }) =>
  apiPost('/api/modify/setPeopleInfo', 'Submission failed', info)
