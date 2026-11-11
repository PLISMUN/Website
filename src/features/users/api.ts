import { apiPost } from '@/lib/api-client'
import type { UserRow } from './types'

export const getUsers = () =>
  apiPost<{ people: UserRow[] }>('/api/retrieve/getUsers', 'Failed to fetch users')

export const updateUser = (user: UserRow) =>
  apiPost<{ people: UserRow[] }>('/api/modify/updateUser', 'Failed to update user', user)

/** Whether the signed-in user is an admin. */
export const getIsAdmin = async () => {
  const result = await apiPost<{ isAdmin: string }[]>('/api/retrieve/getAdmin', 'Failed to check admin status')
  return result[0]?.isAdmin === '1'
}
