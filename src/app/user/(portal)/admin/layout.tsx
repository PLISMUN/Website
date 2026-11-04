"use client"
import { stages } from "@/config/stages"
import React from "react"
import { useSession } from "next-auth/react"
import { getIsAdmin } from "@/features/users/api"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
      const { data: session, status } = useSession()
      const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null)
    
      React.useEffect(() => {
        async function checkAdmin() {
          if (!session?.user?.email) return setIsAdmin(false)
          try {
            setIsAdmin(await getIsAdmin())
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
    <>{children}</>
  )
}