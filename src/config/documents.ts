export type DocumentGroup = {
  id: string
  heading: string
  blurb: string
}

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

export const DOCUMENT_MAX_SIZE_MB = 50
export const DOCUMENT_TITLE_MAX_LENGTH = 100
export const DOCUMENT_DESCRIPTION_MAX_LENGTH = 200

// The sections of the documents pages, in the order they're shown. The documents
// inside them are created by admins from the Documents admin page and live in the
// documents table. An entry with nothing uploaded yet shows as unavailable on the
// public page, and a section with no entries doesn't show at all.
export const documentGroups: DocumentGroup[] = [
  {
    id: "study-guides",
    heading: "Study Guides",
    blurb: "Everything you need to prepare for your committee, written by this year's chairs.",
  },
  {
    id: "rules-procedure",
    heading: "Rules & Procedure",
    blurb: "The rules every committee runs on. Read these before you arrive.",
  },
  {
    id: "getting-started",
    heading: "Getting Started",
    blurb: "New to Model UN? Start here.",
  },
]
