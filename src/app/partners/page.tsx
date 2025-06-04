import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import Partners from "@/components/partners"

function PartnersPage() {
    return (
        <>
        <Header />
        <Partners />
        <FooterSection />
        </>
    )
}

PartnersPage.mainPage = true
export default PartnersPage