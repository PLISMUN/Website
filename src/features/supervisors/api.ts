import { apiPost } from '@/lib/api-client'
import type { NewSupervisorApplication, SupervisorApplication } from './types'

export const getSupervisorApplications = () =>
  apiPost<{ applications: SupervisorApplication[] }>(
    '/api/retrieve/getSupervisorApplications',
    'Failed to load your supervisor applications'
  )

export const submitSupervisorApplication = (application: NewSupervisorApplication) =>
  apiPost('/api/modify/setSupervisorApplication', 'Submission failed', application)

/** Admins: accepts a supervisor application, which emails the applicant. */
export const acceptSupervisorApplication = (supervisorId: number) =>
  apiPost('/api/modify/acceptApplication', 'Failed to accept the supervisor application', { [supervisorId]: true })
