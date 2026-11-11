// A row of the Users admin page. Everything but the account can be missing, as it's filled in later.
export type UserRow = {
  id: number
  email: string
  isGoogleUser: boolean | number
  isAdmin: boolean | number
  name: string | null
  birth: string | null
  phone: string | null
  nationality: string | null
  delegation: string | null
  diet: string | null
  notes: string | null
  valueCzk: number | string | null
  valueEur: number | string | null
  status: boolean
}
