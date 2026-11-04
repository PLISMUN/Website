import React from "react"
import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"
import ForgotPassword from "@/features/auth/forgot-password-form"
import { stages } from "@/config/stages"

export const metadata = {
  title: "PLISMUN | Forgot Password",
  description: "Reset your PLISMUN password."
}

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

export default ForgotPage