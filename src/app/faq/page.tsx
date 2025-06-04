import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import FAQ from "@/components/faqs-section-one"

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