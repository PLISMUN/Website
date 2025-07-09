"use client"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/dashboard-header"
import { Metadata } from "next"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import PaymentWidget from "@/components/paymentWidget"
import { stages } from "@/config/stages"

export default function Page() {
  if (!stages.accountCreation) {
    return null
  }

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
        <SiteHeader title="Payment" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-h-screen">
                <PaymentWidget onSuccess={() => {}} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
