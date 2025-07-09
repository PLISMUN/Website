import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import ForgotPassword from "@/components/forgot-password-one"
import { stages } from "@/config/stages"

function ForgotPage() {
    if (!stages.accountCreation) {
        return null
    }

    return (
        <>
        <Header />
        <ForgotPassword />
        <FooterSection />
        </>
    )
}

ForgotPage.mainPage = true
export default ForgotPage