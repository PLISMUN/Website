"use client"
import React from "react"
import UsersAdmin from "@/components/usersAdmin"

export default function Page() {

  React.useEffect(() => {
    document.title = "PLISMUN | Users Management";
  })

  return (
      <UsersAdmin />
  )
}
