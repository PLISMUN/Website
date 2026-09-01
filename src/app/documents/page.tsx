import React from "react"
import Documents from "@/components/documents"

export const metadata = {
  title: "PLISMUN | Documents",
  description: "Study guides, rules of procedure, and guides for new delegates."
}

function DocumentsPage() {

    return (
    <>
       <Documents />
      </>
    )
    }

DocumentsPage.mainPage = true
export default DocumentsPage
