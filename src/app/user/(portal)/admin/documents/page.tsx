"use client"
import React from "react"
import DocumentsAdmin from "@/components/documentsAdmin"

export default function Page() {
  React.useEffect(() => {
    document.title = "PLISMUN | Documents";
  })

  return (
      <DocumentsAdmin />
  )
}
