import React from "react"
import FAQ from "@/components/faqs-section-one"

export const metadata = {
  title: "PLISMUN | FAQ",
  description: "Frequently Asked Questions about PLISMUN."
}

function FAQPage() {
    return (
        <>
        <FAQ />
        </>
    )
}

FAQPage.mainPage = true
export default FAQPage