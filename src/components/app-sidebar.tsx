"use client"

import * as React from "react"
import {
  IconReport,
  IconUsers,
  IconUser,
  IconCreditCardPay,
  IconConfetti
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
import { title } from "process"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isAdmin, setIsAdmin] = React.useState(false)

  const data = {
    user: {
      name: session?.user?.name || "Delegate",
      email: session?.user?.email || "",
      avatar: session?.user?.image || <IconUser className="size-6" />,
    },
    navMain: [],
    delegate: [
      {
        name: "Apply",
        url: "/user/apply",
        icon: IconConfetti,
      },
      {
        name: "Applications",
        url: "/user/applications",
        icon: IconReport,
      },
      {
        name: "Payment",
        url: "/user/payment",
        icon: IconCreditCardPay,
      }
    ],
    admin: [
      {
        name: "Users",
        url: "/user/admin/users",
        icon: IconUsers,
      },
      {
        name: "Applications",
        url: "/user/admin/applications",
        icon: IconReport,
      },
    ],
  }

  React.useEffect(() => {
    console.log("Session status:", status)
    if (status === "loading") {
      const timer = setTimeout(() => {
        // This will trigger the effect to rerun by updating state
        // or you can just rely on status changing
      }, 2)
      return () => clearTimeout(timer)
    }
    if (status !== "authenticated") {
      router.replace("/user/login")
    }
  }, [status, router])

  React.useEffect(() => {
    async function checkAdmin() {
      if (!session?.user?.email) return
      try {
        const res = await fetch("/api/retrieve/getAdmin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        })
        if (res.ok) {
          const result = await res.json()
          setIsAdmin(result[0]?.isAdmin === "1")
        }
      } catch (e) {
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [session?.user?.email])
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
        <NavCategory items={data.delegate} title="Delegate" />
        {isAdmin && <NavCategory items={data.admin} title="Admin" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
