import { apiPost } from '@/lib/api-client'

export const signup = (email: string, password: string) =>
  apiPost('/api/modify/signup', 'Signup failed', { email, password, google: false })
