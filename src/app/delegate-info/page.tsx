import React from "react"
import Committees from "@/features/committees/committees-section"
import Documents from "@/features/documents/documents-section"
import Venues from "@/features/marketing/venues"
import Schedule from "@/features/marketing/schedule"
import { CallToAction } from "@/features/marketing/call-to-action"
import DelegateHero from "@/features/delegates/delegate-hero"
import DelegateSteps from "@/features/delegates/delegate-steps"
import DelegateFAQ from "@/features/delegates/delegate-faq"

export const metadata = {
  title: "PLISMUN | Delegate Information",
  description: "How to apply as a delegate to PLISMUN, step by step, plus this year's committees, study guides, schedule and venues."
}

// The ids are what the "On this page" links in DelegateHero jump to
function DelegateInfoPage() {
  return (
    <>
      <DelegateHero />
      <div id="how-to-apply" className="scroll-mt-20"><DelegateSteps /></div>
      <div id="committees" className="scroll-mt-20"><Committees /></div>
      <div id="documents" className="scroll-mt-20 bg-muted/50"><Documents compact /></div>
      <div id="schedule" className="scroll-mt-20"><Schedule /></div>
      <div id="venues" className="scroll-mt-20"><Venues /></div>
      <div id="faq" className="scroll-mt-20"><DelegateFAQ /></div>
      <CallToAction text="Ready to apply?" buttonText="Apply as a Delegate" next="/user/dashboard" />
    </>
  )
}

export default DelegateInfoPage
