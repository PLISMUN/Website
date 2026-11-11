import React from "react"
import Committees from "@/features/committees/committees-section"
import Pricing from "@/features/marketing/pricing"
import Venues from "@/features/marketing/venues"
import Schedule from "@/features/marketing/schedule"

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

export default ThisYearPage