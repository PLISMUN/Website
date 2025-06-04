import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import Signup from "@/components/sign-up-one"

function SignupPage() {
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