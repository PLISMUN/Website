import React from "react"
import Header from "@/components/header"
import AboutSection from "@/components/about"
import StatsSection from "@/components/stats-one"
import TeamSection from "@/components/team"
import FooterSection from "@/components/footer-one"

function AboutPage() {
    return (
     <>
        <Header />
        <AboutSection />
        <StatsSection />
        <TeamSection />
        <FooterSection />
    </>
    )
    }

AboutPage.mainPage = true
export default AboutPage