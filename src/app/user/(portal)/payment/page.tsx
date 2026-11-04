"use client"
import PaymentWidget from "@/features/payments/payment-widget"
import { stages } from "@/config/stages"
import React from "react"

export default function Page() {
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
