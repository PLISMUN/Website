import { apiPost } from '@/lib/api-client'

/** Whether key is the current password of the access link. */
export const checkAccess = async (key: string) =>
  (await apiPost<{ valid: boolean }>('/api/retrieve/checkAccess', 'Failed to check the access link', { key })).valid
