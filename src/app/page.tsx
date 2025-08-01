import React from "react"
import HeroSection from "@/components/hero"
import News from "@/components/news"
import FooterSection from "@/components/footer-one"
import Committees from "@/components/committees"


function Home() {
  
  return (
    <>
        <HeroSection />
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