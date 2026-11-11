"use client"
import React from "react"
import UsersAdmin from "@/features/users/users-admin"

export default function Page() {

  React.useEffect(() => {
    document.title = "PLISMUN | Users Management";
  })

  return (
      <UsersAdmin />
  )
}
