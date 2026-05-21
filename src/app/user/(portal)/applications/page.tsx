"use client"
import { stages } from "@/config/stages"
import React from "react"
import ApplicationsList from "@/components/applications"

export default function Page() {
  if (!stages.accountCreation) {
    return null
  }

    React.useEffect(() => {
      document.title = "PLISMUN | Applications";
    }, []);

  return (
      <ApplicationsList />
  )
}
