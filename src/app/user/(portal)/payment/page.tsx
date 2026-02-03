"use client"
import PaymentWidget from "@/components/paymentWidget"
import { stages } from "@/config/stages"
import React from "react"

export default function Page() {
  if (!stages.accountCreation) {
    return null
  }

    React.useEffect(() => {
      document.title = "PLISMUN | Payment";
    }, []);

  return (
      <PaymentWidget onSuccess={() => {}} />
  )
}
