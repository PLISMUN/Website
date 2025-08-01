"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/dashboard-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { stages } from "@/config/stages"
import React from "react"
import ApplicationsAdmin from "@/components/applicationsAdmin"
import { useSession } from "next-auth/react"

export default function Page() {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    document.title = "PLISMUN | Applications";
    async function checkAdmin() {
      if (!session?.user?.email) return setIsAdmin(false)
      try {
        const res = await fetch("/api/retrieve/getAdmin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        })
        if (res.ok) {
          const result = await res.json()
          setIsAdmin(result[0]?.isAdmin === "1")
        } else {
          setIsAdmin(false)
        }
      } catch {
        setIsAdmin(false)
      }
    }
    if (status === "authenticated") checkAdmin()
  }, [session, status])

  if (!stages.accountCreation) return null
  if (isAdmin === false) return <div>Unauthorized</div>
  if (isAdmin === null) return <div>Loading...</div>

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Applications" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-h-screen">
              <ApplicationsAdmin />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
