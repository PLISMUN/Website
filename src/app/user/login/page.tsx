import React from "react"
import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"
import Login from "@/features/auth/login-form"
import { getSiteConfig } from "@/server/site-config"

export const metadata = {
  title: "PLISMUN | Login",
  description: "Login to PLISMUN."
}

async function LoginPage() {
    const { stages } = await getSiteConfig()
  if (!stages.accountCreation) {
    return null
  }

  return (
    <>
      <Header />
      <Login />
      <FooterSection />
    </>
  )
}

export default LoginPage