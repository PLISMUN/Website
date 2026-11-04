import React from "react"
import Committees from "@/features/committees/committees-section"
import Documents from "@/features/documents/documents-section"
import Venues from "@/features/marketing/venues"
import Schedule from "@/features/marketing/schedule"
import { CallToAction } from "@/features/marketing/call-to-action"

export const metadata = {
  title: "PLISMUN | Delegate Information",
  description: "Learn more about PLISMUN."
}

function DelegateInfoPage() {

    return (
    <>
      <CallToAction text="Apply to be a Delegate today!" />
        <Documents compact />
        <Committees />
        <Venues />
        <Schedule />
      </>
    )
    }

export default DelegateInfoPage