import React from "react"
import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"
import Login from "@/features/auth/login-form"
import { getSiteConfig } from "@/server/site-config"
import { pageHasAccess, type SearchParams } from "@/server/page-access"

export const metadata = {
  title: "PLISMUN | Login",
  description: "Login to PLISMUN."
}

async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
    const { stages } = await getSiteConfig()
  if (!stages.accountCreation && !(await pageHasAccess(searchParams))) {
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