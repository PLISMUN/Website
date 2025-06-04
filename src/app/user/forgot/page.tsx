import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import ForgotPassword from "@/components/forgot-password-one"

function ForgotPage() {
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