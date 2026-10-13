"use client"
import React from "react"
import DelegationsAdmin from "@/components/delegationsAdmin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Delegations";
  })

  return (
      <DelegationsAdmin />
  )
}
