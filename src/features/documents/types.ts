export type DocumentEntry = {
  id: number
  groupId: string
  title: string
  description: string
  // Where the PDF lives in the Vercel Blob store. Set once when the entry is created.
  path: string
  // All null until a PDF has been uploaded
  url: string | null
  size: number | null
  uploadedAt: string | null
}
