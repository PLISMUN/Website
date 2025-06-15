"use client"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/dashboard-header"
import { Metadata } from "next"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import DelegateInfoQuestion from "@/components/delegateInfoQuestion"
import DelegateTypePick from "@/components/delegateTypePick"

export default function Page() {
  const [infoSubmitted, setInfoSubmitted] = useState(false)
  const [typeSubmitted, setTypeSubmitted] = useState("")

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
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {!infoSubmitted ? (
                <DelegateInfoQuestion onSuccess={() => setInfoSubmitted(true)} />
              ) : typeSubmitted === "" ? (
                <DelegateTypePick onPickType={(type) => {setTypeSubmitted(type)}} />
              ) : typeSubmitted === "chair" ? (
                <div>chair</div>
              ) : (
                <div>delegate</div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
