import React from "react"
import HeroSection from "@/features/marketing/hero"
import News from "@/features/marketing/news"
import Committees from "@/features/committees/committees-section"
import Countdown from "@/features/marketing/countdown";


function Home() {
  
  return (
    <>
        <HeroSection />
        <Countdown />
        <Committees />
        <News />
    </>
  )
}


export const metadata = {
  title: "PLISMUN | Home",
  description: "Welcome to PLISMUN, an internationally renowned MUN Conference hosted by Park Lane International School.",
  
}

export default Home