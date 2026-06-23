import React from "react"
import HeroSection from "@/components/hero"
import News from "@/components/news"
import Committees from "@/components/committees"
import Countdown from "@/components/countdown";


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

Home.mainPage = true

export const metadata = {
  title: "PLISMUN | Home",
  description: "Welcome to PLISMUN, an internationally renowned MUN Conference hosted by Park Lane International School.",
  
}

export default Home