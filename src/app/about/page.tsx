import React from "react"
import AboutSection from "@/features/marketing/about-section"
import StatsSection from "@/features/marketing/stats"

export const metadata = {
  title: "PLISMUN | About Us",
  description: "Learn more about PLISMUN."
}

function AboutPage() {

    return (
    <>
       <AboutSection />
       <StatsSection />
      </>
    )
    }

export default AboutPage