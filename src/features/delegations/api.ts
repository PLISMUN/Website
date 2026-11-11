import { apiPost } from '@/lib/api-client'
import type {
  Delegation,
  DelegationSupervisor,
  Member,
  PublicDelegation,
  SupervisedDelegation,
  SupervisorCandidate,
} from './types'

export const getDelegations = () =>
  apiPost<PublicDelegation[]>('/api/retrieve/getDelegations', 'Failed to fetch delegations')

export const getAllDelegations = () =>
  apiPost<{ delegations: Delegation[]; supervisors: DelegationSupervisor[]; users: SupervisorCandidate[] }>(
    '/api/retrieve/getAllDelegations',
    'Failed to fetch delegations'
  )

export const getSupervisedDelegations = () =>
  apiPost<{ delegations: SupervisedDelegation[] }>('/api/retrieve/getSupervisedDelegations', 'Failed to fetch your delegations')

export const getDelegationMembers = (delegationId: number) =>
  apiPost<{ delegation: SupervisedDelegation; members: Member[] }>(
    '/api/retrieve/getDelegationMembers',
    'Failed to fetch delegation members',
    { delegationId }
  )

export const saveDelegation = (delegation: { id?: number; name: string; shorthand: string; country: string; notes: string }) =>
  apiPost<{ id: number }>('/api/modify/setDelegation', 'Failed to save delegation', delegation)

export const setDelegationSupervisor = (
  change:
    | { action: 'link'; delegationId: number; supervisorId: number }
    | { action: 'add'; delegationId: number; userId: number }
    | { action: 'remove'; supervisorId: number }
) => apiPost('/api/modify/setDelegationSupervisor', 'Failed to update supervisors', change)
