// A supervisor application as the supervisor sees it
export type SupervisorApplication = {
  id: number
  delegation: string
  status: string
  country: string | null
  students: number | null
  linked: boolean
  paid: boolean
  memberCount: number
}

export type NewSupervisorApplication = {
  name: string
  phone: string
  nationality: string
  birth: string
  diet: string
  notes: string
  existing: boolean
  delegation: string
  country: string
  students: number
}
