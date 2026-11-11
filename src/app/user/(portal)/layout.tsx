import { PortalSidebar } from "@/components/layout/portal-sidebar"
import { PortalHeader } from "@/components/layout/portal-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import FooterSection from "@/components/layout/footer"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <PortalSidebar variant="inset" />
      <SidebarInset>
        <PortalHeader title="Applications" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col min-h-screen">
                {children}
            <FooterSection />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    )
}