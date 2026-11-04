import React from "react"
import SupervisorHero from "@/features/supervisors/supervisor-hero"
import SupervisorSteps from "@/features/supervisors/supervisor-steps"
import SupervisorPortalTour from "@/features/supervisors/supervisor-portal-tour"
import SupervisorFAQ from "@/features/supervisors/supervisor-faq"
import { CallToAction } from "@/features/marketing/call-to-action"
import { SUPERVISOR_APPLY_PATH } from "@/features/supervisors/paths"

export const metadata = {
  title: "PLISMUN | Supervisors",
  description: "Teachers and supervisors: how to register your delegation for PLISMUN, how the process works, and what you can do in the portal."
}

function SupervisorsPage() {
    return (
    <>
        <SupervisorHero />
        <SupervisorSteps />
        <SupervisorPortalTour />
        <SupervisorFAQ />
        <CallToAction text="Ready to register your delegation?" buttonText="Apply as a Supervisor" next={SUPERVISOR_APPLY_PATH} />
    </>
    )
}

export default SupervisorsPage
