import { apiPost } from '@/lib/api-client'
import type { Committee } from './types'

export const getCommittees = () =>
  apiPost<Committee[]>('/api/retrieve/getCommittees', 'Failed to fetch committees')
