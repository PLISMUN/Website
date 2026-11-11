"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconFileText,
  IconReport,
  IconUsers,
  IconUser,
  IconCreditCardPay,
  IconConfetti,
  IconFlag,
  IconUsersGroup,
  IconUserShield,
  IconSettings,
  IconWorld
} from "@tabler/icons-react"

import { NavCategory } from "@/components/layout/nav-category"
import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
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
import { getSupervisorApplications } from "@/features/supervisors/api"
import { SUPERVISOR_APPLY_PATH } from "@/features/supervisors/paths"
import { getIsAdmin } from "@/features/users/api"


export function PortalSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isAdmin, setIsAdmin] = React.useState(false)
  // applicant: has a supervisor application that wasn't rejected; leader: can see My Delegation.
  // null until known, so students and supervisors don't briefly see each other's menu
  const [supervisorRole, setSupervisorRole] = React.useState<{ applicant: boolean, leader: boolean } | null>(null)

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
        url: "/user/dashboard",
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
    supervisor: [
      {
        name: supervisorRole?.applicant ? "Supervisor Application" : "Apply as Supervisor",
        url: SUPERVISOR_APPLY_PATH,
        icon: IconUserShield,
      },
      ...(supervisorRole?.leader ? [{
        name: "My Delegation",
        url: "/user/supervisor/delegation",
        icon: IconUsersGroup,
      }] : []),
      ...(supervisorRole?.applicant ? [{
        name: "Payment",
        url: "/user/payment",
        icon: IconCreditCardPay,
      }] : []),
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
      {
        name: "Delegations",
        url: "/user/admin/delegations",
        icon: IconFlag,
      },
      {
        name: "Committees",
        url: "/user/admin/committees",
        icon: IconWorld,
      },
      {
        name: "Documents",
        url: "/user/admin/documents",
        icon: IconFileText,
      },
      {
        name: "Settings",
        url: "/user/admin/settings",
        icon: IconSettings,
      },
    ],
  }

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/user/login")
    }
  }, [status, router])

  React.useEffect(() => {
    async function checkAdmin() {
      if (!session?.user?.email) return
      try {
        setIsAdmin(await getIsAdmin())
      } catch {
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [session?.user?.email])

  React.useEffect(() => {
    async function checkSupervisor() {
      if (!session?.user?.email) return
      try {
        const { applications } = await getSupervisorApplications()
        setSupervisorRole({
          applicant: applications.some((a) => a.status !== "rejected"),
          leader: applications.some((a) => a.status === "accepted" && a.linked),
        })
      } catch {
        setSupervisorRole({ applicant: false, leader: false })
      }
    }
    checkSupervisor()
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
                <Link href="/">
                <img src="/logo.png" alt="PLISMUN Logo" className="!size-5" />
                <span className="text-base font-semibold">PLISMUN</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {supervisorRole && !supervisorRole.applicant && <NavCategory items={data.delegate} title="Delegate" />}
        {supervisorRole && <NavCategory items={data.supervisor} title={supervisorRole.applicant ? "Supervisor" : "Teachers & Supervisors"} />}
        {isAdmin && <NavCategory items={data.admin} title="Admin" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
