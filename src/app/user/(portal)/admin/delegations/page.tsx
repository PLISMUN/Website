"use client"
import React from "react"
import DelegationsAdmin from "@/features/delegations/delegations-admin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Delegations";
  })

  return (
      <DelegationsAdmin />
  )
}
