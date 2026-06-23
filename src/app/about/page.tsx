import React from "react"
import AboutSection from "@/components/about"
import StatsSection from "@/components/stats-one"
import TeamSection from "@/components/team"

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

AboutPage.mainPage = true
export default AboutPage