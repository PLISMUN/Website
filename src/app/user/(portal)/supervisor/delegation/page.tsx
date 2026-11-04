"use client"
import React from "react"
import DelegationMembers from "@/features/delegations/delegation-members"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | My Delegation";
  })

  return (
      <DelegationMembers />
  )
}
