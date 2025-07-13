"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/dashboard-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { stages } from "@/config/stages"
import React from "react"
import ApplicationsList from "@/components/applications"

export default function Page() {
  if (!stages.accountCreation) {
    return null
  }

    React.useEffect(() => {
      document.title = "PLISMUN | Applications";
    }, []);

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
              <ApplicationsList />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
