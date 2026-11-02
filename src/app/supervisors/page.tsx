import React from "react"
import SupervisorHero from "@/components/supervisorHero"
import SupervisorSteps from "@/components/supervisorSteps"
import SupervisorPortalTour from "@/components/supervisorPortalTour"
import SupervisorFAQ from "@/components/supervisorFaq"
import { CallToAction } from "@/components/call-to-action"
import { SUPERVISOR_APPLY_PATH } from "@/config/supervisor"

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

SupervisorsPage.mainPage = true
export default SupervisorsPage
