// A delegation as anyone can see it, in the list students pick from
export type PublicDelegation = {
  id: number
  name: string
  shorthand: string
  country: string
}

export type SupervisedDelegation = PublicDelegation

export type Delegation = PublicDelegation & {
  notes: string
  memberCount: number
}

// A supervisor application as admins see it on the Delegations page
export type DelegationSupervisor = {
  id: number
  userId: number
  delegation: string
  status: string
  country: string | null
  students: number | null
  email: string
  name: string | null
}

export type SupervisorCandidate = {
  id: number
  email: string
  name: string | null
  isSupervisor: boolean
}

export type MemberApplication = {
  id: number
  type: string
  committeeName: string
  role: string
  status: string
}

export type Member = {
  id: number
  email: string
  name: string
  birth: string
  phone: string
  nationality: string
  diet: string
  notes: string
  valueCzk: number | null
  valueEur: number | null
  paymentStatus: boolean
  applications: MemberApplication[]
}
