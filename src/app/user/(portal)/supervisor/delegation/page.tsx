"use client"
import React from "react"
import DelegationMembers from "@/components/delegationMembers"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | My Delegation";
  })

  return (
      <DelegationMembers />
  )
}
