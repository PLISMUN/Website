// A delegate or chair application, or a supervisor application in the same shape
export type Application = {
  id: number
  committeeName: string
  role: string
  status: string
  type: string
  notes: string | null
}

// An application from getAllApplications, with the applicant's details on it
export type AdminApplication = Application & {
  userId: number
  userEmail: string
  name: string
  birth: string
  phone: string
  nationality: string
  delegation: string
  userNotes: string
  paymentStatus: boolean
}

export type NewApplication = {
  email: string
  type: string
  committee: string
  role: string
  notes: string
}
