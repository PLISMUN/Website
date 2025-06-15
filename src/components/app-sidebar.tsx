"use client"

import * as React from "react"
import {
  IconReport,
  IconUsers,
  IconUser,
} from "@tabler/icons-react"

import { NavCategory } from "@/components/nav-category"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const data = {
    user: {
      name: session?.user?.name || "Delegate",
      email: session?.user?.email || "",
      avatar: session?.user?.image || <IconUser className="size-6" />,
    },
    navMain: [
    ],
    admin: [
      {
        name: "Users",
        url: "#",
        icon: IconUsers,
      },
      {
        name: "Applications",
        url: "#",
        icon: IconReport,
      },
    ],
  }

  React.useEffect(() => {
    if (status !== "authenticated") {
      router.replace("/user/login")
    }
  }, [status, router])
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
                <a href="/">
                <img src="/logo.png" alt="PLISMUN Logo" className="!size-5" />
                <span className="text-base font-semibold">PLISMUN</span>
                </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCategory items={data.admin} title="Admin" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
