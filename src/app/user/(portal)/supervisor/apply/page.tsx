"use client"
import React from "react"
import SupervisorApplication from "@/components/supervisorApplication"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Supervisor Application";
  }, [])

  return (
      <SupervisorApplication />
  )
}
