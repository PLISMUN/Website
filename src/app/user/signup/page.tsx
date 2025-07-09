import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import Signup from "@/components/sign-up-one"
import { stages } from "@/config/stages"


function SignupPage() {
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

SignupPage.mainPage = true
export default SignupPage