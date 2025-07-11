import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import FAQ from "@/components/faqs-section-one"

export const metadata = {
  title: "PLISMUN | FAQ",
  description: "Frequently Asked Questions about PLISMUN."
}

function FAQPage() {
    return (
        <>
        <Header />
        <FAQ />
        <FooterSection />
        </>
    )
}

FAQPage.mainPage = true
export default FAQPage