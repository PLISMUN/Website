import React from "react"
import Header from "@/components/header"
import FooterSection from "@/components/footer-one"
import Login from "@/components/login-one"

function LoginPage() {
    return (
        <>
        <Header />
        <Login />
        <FooterSection />
        </>
    )
}

LoginPage.mainPage = true
export default LoginPage