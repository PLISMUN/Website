"use client"
import { stages } from "@/config/stages"
import React from "react"
import { useSession } from "next-auth/react"

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
    <>{children}</>
  )
}