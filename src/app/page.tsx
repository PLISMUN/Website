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
        <FooterSection />
    </>
  )
}

Home.mainPage = true

export default Home