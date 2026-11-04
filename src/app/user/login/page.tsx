import React from "react"
import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"
import Login from "@/features/auth/login-form"
import { stages } from "@/config/stages"

export const metadata = {
  title: "PLISMUN | Login",
  description: "Login to PLISMUN."
}

function LoginPage() {
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