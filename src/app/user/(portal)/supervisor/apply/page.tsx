"use client"
import React from "react"
import SupervisorApplication from "@/features/supervisors/supervisor-application"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Supervisor Application";
  }, [])

  return (
      <SupervisorApplication />
  )
}
