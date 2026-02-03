"use client"
import React from "react"
import ApplicationsAdmin from "@/components/applicationsAdmin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Applications";
  })

  return (
      <ApplicationsAdmin />
  )
}
