import React from "react"
import TeamSection from "@/components/team"

export const metadata = {
  title: "PLISMUN | Team",
  description: "Learn more about our team."
}

function TeamPage() {

    return (
    <>
       <TeamSection />
      </>
    )
    }

TeamPage.mainPage = true
export default TeamPage