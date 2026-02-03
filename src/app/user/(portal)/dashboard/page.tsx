"use client"
import { useState } from "react"
import DelegateInfoQuestion from "@/components/delegateInfoQuestion"
import DelegateTypePick from "@/components/delegateTypePick"
import DelegateApply from "@/components/delegateApply"
import ChairApply from "@/components/chairApply"
import SupervisorApply from "@/components/supervisorApply"
import PaymentWidget from "@/components/paymentWidget"
import { stages } from "@/config/stages"
import React from "react"

export default function Page() {
  const [infoSubmitted, setInfoSubmitted] = useState(false)
  const [typeSubmitted, setTypeSubmitted] = useState("")
  const [applySuccess, setApplySuccess] = useState(false)

  if (!stages.accountCreation) {
    return null
  }

    React.useEffect(() => {
      document.title = "PLISMUN | Dashboard";
    }, []);

  return (
    <>
    {applySuccess ? (
    <PaymentWidget />
    ) : !infoSubmitted ? (
    <DelegateInfoQuestion onSuccess={() => setInfoSubmitted(true)} />
    ) : typeSubmitted === "" ? (
    <DelegateTypePick onPickType={(type) => {setTypeSubmitted(type)}} />
    ) : typeSubmitted === "chair" ? (
    <ChairApply onSuccess={() => setApplySuccess(true)}/>
    ) : typeSubmitted === "supervisor" ? (
      <SupervisorApply onSuccess={() => setApplySuccess(true)}/>
    ) : (
      <DelegateApply onSuccess={() => setApplySuccess(true)}/>
    )}
  </>
  )
}
