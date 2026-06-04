"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@/styles/main.css';
import { SessionProvider } from "next-auth/react"
// import { ViewTransition } from 'react' // Uncomment when View Transitions are supported in main release of react
import { usePathname } from "next/navigation"

import { Header } from "@/components/header";
import FooterSection from "@/components/footer-one"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname?.startsWith("/user");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
        {!hideHeaderFooter && <Header />}
          {/*<ViewTransition>*/}
            {children}
          {/*</ViewTransition>*/}
        </SessionProvider>
        {!hideHeaderFooter && <FooterSection />}
      </body>
    </html>
  );
}
