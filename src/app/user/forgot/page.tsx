import React from "react"
import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"
import ForgotPassword from "@/features/auth/forgot-password-form"
import { getSiteConfig } from "@/server/site-config"

export const metadata = {
  title: "PLISMUN | Forgot Password",
  description: "Reset your PLISMUN password."
}

async function ForgotPage() {
    const { stages } = await getSiteConfig()
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