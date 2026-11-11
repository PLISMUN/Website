"use client"
import React from "react"
import DocumentsAdmin from "@/features/documents/documents-admin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Documents";
  })

  return (
      <DocumentsAdmin />
  )
}
