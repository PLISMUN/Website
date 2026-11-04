"use client"
import { stages } from "@/config/stages"
import React from "react"
import ApplicationsList from "@/features/applications/applications-list"

export default function Page() {
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
