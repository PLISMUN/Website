import { apiPost } from '@/lib/api-client'
import type { AdminApplication, Application, NewApplication } from './types'

export const getApplications = (email: string) =>
  apiPost<{ applications: Application[] }>('/api/retrieve/getApplications', 'Failed to fetch applications', { email })

export const getAllApplications = () =>
  apiPost<{ applications: AdminApplication[] }>('/api/retrieve/getAllApplications', 'Failed to fetch applications')

export const submitApplication = (application: NewApplication) =>
  apiPost<{ applicationId: number }>('/api/modify/setApplication', 'Submission failed', application)

/** Sets applications to accepted (true) or rejected (false), by ID. */
export const decideApplications = (decisions: Record<string, boolean>) =>
  apiPost('/api/modify/acceptApplication', 'Failed to update applications', decisions)
