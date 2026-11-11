"use client"
import React from "react"
import SiteConfigAdmin from "@/features/site-config/site-config-admin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Settings";
  }, [])

  return (
      <SiteConfigAdmin />
  )
}
