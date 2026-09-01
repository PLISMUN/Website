export type DocumentEntry = {
  title: string
  description: string
  href: string
}

export type DocumentGroup = {
  heading: string
  blurb: string
  documents: DocumentEntry[]
}

// The study guides are listed here rather than pulled from the committees table
// on purpose: a committee existing in the DB doesn't mean its guide has been
// written yet, and we'd rather show nothing than a link that 404s.
// When a new guide is ready, drop the PDF into public/documents/study-guides/
// and add its entry below.
export const documentGroups: DocumentGroup[] = [
  {
    heading: "Study Guides",
    blurb: "Everything you need to prepare for your committee, written by this year's chairs.",
    documents: [
      {
        title: "Security Council",
        description: "SC — Advanced",
        href: "/documents/study-guides/sc.pdf",
      },
      {
        title: "Historical British Parliament",
        description: "HBP — Advanced",
        href: "/documents/study-guides/hbp.pdf",
      },
      {
        title: "United Nations Office for Counter-Terrorism",
        description: "UNOCT — Intermediate",
        href: "/documents/study-guides/unoct.pdf",
      },
      {
        title: "Organisation for Security and Cooperation in Europe",
        description: "OSCE — Intermediate",
        href: "/documents/study-guides/osce.pdf",
      },
      {
        title: "Special Political and Decolonisation Committee",
        description: "SPECPOL — Intermediate",
        href: "/documents/study-guides/specpol.pdf",
      },
      {
        title: "World Health Organisation",
        description: "WHO — Beginner",
        href: "/documents/study-guides/who.pdf",
      },
      {
        title: "United Nations Office on Drugs and Crime",
        description: "UNODC — Beginner",
        href: "/documents/study-guides/unodc.pdf",
      },
      {
        title: "Economic and Social Council",
        description: "ECOSOC — Beginner",
        href: "/documents/study-guides/ecosoc.pdf",
      },
    ],
  },
  {
    heading: "Rules & Procedure",
    blurb: "The rules every committee runs on. Read these before you arrive.",
    documents: [
      {
        title: "Rules of Procedure",
        description: "How debate, motions and voting work at PLISMUN.",
        href: "/documents/rules-of-procedure.pdf",
      },
    ],
  },
  {
    heading: "Getting Started",
    blurb: "New to Model UN? Start here.",
    documents: [
      {
        title: "Beginner's Guide",
        description: "A walkthrough of your first conference, from position papers to placards.",
        href: "/documents/beginner-guide.pdf",
      },
    ],
  },
]
