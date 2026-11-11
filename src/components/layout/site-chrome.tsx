"use client"
import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
// import { ViewTransition } from 'react' // Uncomment when View Transitions are supported in main release of react
import { usePathname } from "next/navigation"

import Header from "@/components/layout/header"
import FooterSection from "@/components/layout/footer"

// The public site's header and footer. The portal under /user has its own.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname?.startsWith("/user");

  return (
    <>
      <SessionProvider>
        {!hideHeaderFooter && <Header />}
        {/*<ViewTransition>*/}
          {children}
        {/*</ViewTransition>*/}
      </SessionProvider>
      {!hideHeaderFooter && <FooterSection />}
    </>
  );
}
