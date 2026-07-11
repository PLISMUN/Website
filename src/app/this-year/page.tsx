import React from "react"
import Committees from "@/components/committees"
import Pricing from "@/components/pricing-section-two"
import Venues from "@/components/venues"
import Schedule from "@/components/schedule"

export const metadata = {
  title: "PLISMUN | Details",
  description: "PLISMUN Conference Details."
}

function ThisYearPage() {
    return (
     <>
        <Committees />
        <Pricing />
        <Venues />
        <Schedule />
    </>
    )
}

ThisYearPage.mainPage = true
export default ThisYearPage