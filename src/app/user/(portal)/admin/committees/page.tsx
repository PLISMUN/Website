"use client"
import React from "react"
import CommitteesAdmin from "@/features/committees/committees-admin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Committees";
  }, [])

  return (
      <CommitteesAdmin />
  )
}
