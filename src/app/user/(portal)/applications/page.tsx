"use client"
import { useSiteConfig } from "@/features/site-config/context"
import React from "react"
import ApplicationsList from "@/features/applications/applications-list"

export default function Page() {
  const { stages } = useSiteConfig()

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
