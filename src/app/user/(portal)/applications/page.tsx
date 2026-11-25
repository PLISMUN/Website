"use client"
import { useStages } from "@/features/access/context"
import React from "react"
import ApplicationsList from "@/features/applications/applications-list"

export default function Page() {
  const stages = useStages()

  React.useEffect(() => {
    document.title = "PLISMUN | Applications";
  }, []);

  if (!stages.accountCreation) {
    return null
  }

  return (
      <ApplicationsList />
  )
}
