"use client"
import React from "react"
import ApplicationsAdmin from "@/features/applications/applications-admin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Applications";
  })

  return (
      <ApplicationsAdmin />
  )
}
