export type DocumentGroup = {
  id: string
  heading: string
  blurb: string
}

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
    id: "useful-important",
    heading: "Useful & Important Documents",
    blurb: "The rules of procedure, guides, and anything else worth reading before you arrive.",
  },
]

export const DOCUMENT_MAX_SIZE_MB = 50
export const DOCUMENT_TITLE_MAX_LENGTH = 100
export const DOCUMENT_DESCRIPTION_MAX_LENGTH = 200
