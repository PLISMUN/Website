// What each type of participant pays. These are used for the prices on the site and for the
// amount set on someone's payment, so changing one doesn't change what people were already charged:
// existing amounts live in the payments table, and admins can edit them on the Users admin page.
export const pricing = {
  delegate: { czk: 1700, eur: 70 },
  chair: { czk: 1000, eur: 40 },
  supervisor: { czk: 1000, eur: 40 },
}

export type PricingTier = keyof typeof pricing

export const isPricingTier = (value: unknown): value is PricingTier =>
  typeof value === 'string' && Object.hasOwn(pricing, value)
