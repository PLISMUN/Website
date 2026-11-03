"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { IconUserShield } from "@tabler/icons-react"
import DelegateInfoQuestion from "@/components/delegateInfoQuestion"
import DelegateTypePick from "@/components/delegateTypePick"
import DelegateApply from "@/components/delegateApply"
import ChairApply from "@/components/chairApply"
import PaymentWidget from "@/components/paymentWidget"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { stages } from "@/config/stages"
import { SUPERVISOR_APPLY_PATH } from "@/config/supervisor"
import React from "react"

export default function Page() {
  const [infoSubmitted, setInfoSubmitted] = useState(false)
  const [typeSubmitted, setTypeSubmitted] = useState("")
  const [applySuccess, setApplySuccess] = useState(false)
  // Supervisors have their own application; wait to find out before showing the student one
  const [isSupervisor, setIsSupervisor] = useState<boolean | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

    React.useEffect(() => {
      document.title = "PLISMUN | Dashboard";
    }, []);

  useEffect(() => {
    if (!session?.user?.email) return
    const checkSupervisor = async () => {
      try {
        const res = await fetch("/api/retrieve/getSupervisorApplications", { method: "POST" })
        const data = res.ok ? await res.json() : null
        const applicant = Boolean(data?.applications?.some((a: { status: string }) => a.status !== "rejected"))
        if (applicant) router.replace(SUPERVISOR_APPLY_PATH)
        setIsSupervisor(applicant)
      } catch {
        setIsSupervisor(false)
      }
    }
    checkSupervisor()
  }, [session?.user?.email, router])

  if (!stages.accountCreation || isSupervisor !== false) return null

  return (
    <>
    {applySuccess ? (
    <PaymentWidget />
    ) : !infoSubmitted ? (
    <>
      <SupervisorSignpost />
      <DelegateInfoQuestion onSuccess={() => setInfoSubmitted(true)} />
    </>
    ) : typeSubmitted === "" ? (
    <DelegateTypePick onPickType={(type) => {setTypeSubmitted(type)}} />
    ) : typeSubmitted === "chair" ? (
    <ChairApply onSuccess={() => setApplySuccess(true)}/>
    ) : (
      <DelegateApply onSuccess={() => setApplySuccess(true)}/>
    )}
  </>
  )
}

function SupervisorSignpost() {
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-4xl px-4 lg:px-0">
        <Alert className="border-sky-200 bg-sky-50">
          <IconUserShield className="text-sky-700" />
          <AlertTitle>Are you a teacher or supervisor?</AlertTitle>
          <AlertDescription>
            <p>
              This form is for students. Teachers and staff leading a delegation have their own application.{" "}
              <Link href={SUPERVISOR_APPLY_PATH} className="font-medium text-sky-700 underline">Apply as a supervisor</Link>
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </section>
  )
}
