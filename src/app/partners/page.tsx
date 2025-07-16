import React from "react"
import Partners from "@/components/partners"

export const metadata = {
  title: "PLISMUN | Partners",
  description: "PLISMUN Partners."
}

function PartnersPage() {
    return (
        <>
        <Partners />
        </>
    )
}

PartnersPage.mainPage = true
export default PartnersPage