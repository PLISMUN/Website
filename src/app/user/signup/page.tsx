import React from "react"
import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"
import Signup from "@/features/auth/signup-form"
import { getSiteConfig } from "@/server/site-config"


export const metadata = {
  title: "PLISMUN | Sign Up",
  description: "Sign up for PLISMUN."
}

async function SignupPage() {
    const { stages } = await getSiteConfig()
      if (!stages.accountCreation) {
        return null
      }

    return (
        <>
        <Header />
        <Signup />
        <FooterSection />
        </>
    )
}

export default SignupPage