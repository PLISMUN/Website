import React from "react"
import Committees from "@/components/committees"
import Documents from "@/components/documents"
import Venues from "@/components/venues"
import Schedule from "@/components/schedule"
import { CallToAction } from "@/components/call-to-action"

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

DelegateInfoPage.mainPage = true
export default DelegateInfoPage

// Apply call to action + price
// committees
// venues
// schedule