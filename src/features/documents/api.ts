import { apiPost } from '@/lib/api-client'
import type { DocumentEntry } from './types'

// Passed to upload() from @vercel/blob/client, which makes the request itself
export const DOCUMENT_UPLOAD_URL = '/api/modify/uploadDocument'

export const getDocuments = () =>
  apiPost<{ documents: DocumentEntry[] }>('/api/retrieve/getDocuments', 'Failed to fetch documents')

export const setDocument = (
  change:
    | { action: 'create'; groupId: string; title: string; description: string }
    | { action: 'publish' | 'delete'; id: number }
) => apiPost('/api/modify/setDocument', 'Failed to save the document', change)
