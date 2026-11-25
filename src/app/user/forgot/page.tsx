import React from "react"
import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"
import ForgotPassword from "@/features/auth/forgot-password-form"
import { getSiteConfig } from "@/server/site-config"
import { pageHasAccess, type SearchParams } from "@/server/page-access"

export const metadata = {
  title: "PLISMUN | Forgot Password",
  description: "Reset your PLISMUN password."
}

async function ForgotPage({ searchParams }: { searchParams: SearchParams }) {
    const { stages } = await getSiteConfig()
    if (!stages.accountCreation && !(await pageHasAccess(searchParams))) {
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