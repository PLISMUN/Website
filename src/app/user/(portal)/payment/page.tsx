"use client"
import PaymentWidget from "@/features/payments/payment-widget"
import { useSiteConfig } from "@/features/site-config/context"
import React from "react"

export default function Page() {
  const { stages } = useSiteConfig()

  React.useEffect(() => {
    document.title = "PLISMUN | Payment";
  }, []);

  if (!stages.accountCreation) {
    return null
  }

  return (
      <PaymentWidget />
  )
}
