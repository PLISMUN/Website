"use client"
import PaymentWidget from "@/features/payments/payment-widget"
import { useStages } from "@/features/access/context"
import React from "react"

export default function Page() {
  const stages = useStages()

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
