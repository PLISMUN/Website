import { apiPost } from '@/lib/api-client'
import type { PricingTier } from '@/config/pricing'
import type { PaymentInfo } from './types'

/** The user's payment. Creates one at the delegate price if they don't have one yet. */
export const getPayment = (email: string) =>
  apiPost<PaymentInfo[]>('/api/retrieve/getPayment', 'Failed to fetch your payment', { email })

/** Admins: sets what a user owes to the price of a type of participant. */
export const setPaymentTier = (email: string, tier: PricingTier) =>
  apiPost('/api/modify/setPayment', 'Failed to set the payment', { email, tier })

/** Admins: marks a user's payment as received. */
export const confirmPayment = (email: string) =>
  apiPost('/api/modify/acceptPayment', 'Failed to confirm the payment', { email })
