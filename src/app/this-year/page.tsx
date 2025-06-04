import React from "react"
import Header from "@/components/header"
import Committees from "@/components/committees"
import FooterSection from "@/components/footer-one"
import Pricing from "@/components/pricing-section-two"
import Venues from "@/components/venues"
import Schedule from "@/components/schedule"

function ThisYearPage() {
    return (
     <>
        <Header />
        <Committees />
        <Pricing />
        <Venues />
        <Schedule />
        <FooterSection />
    </>
    )
}

ThisYearPage.mainPage = true
export default ThisYearPage