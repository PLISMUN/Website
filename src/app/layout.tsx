import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@/styles/main.css';

import { SiteChrome } from "@/components/layout/site-chrome"
import { Analytics } from "@/components/analytics"
import { SiteConfigProvider } from "@/features/site-config/context"
import { getSiteConfig } from "@/server/site-config"

// Pages are cached. Saving on the Settings admin page clears the cached settings, so pages are rebuilt on
// their next visit (see src/server/site-config.ts). This is the fallback for what has no save to clear it,
// like committees edited by hand in the database: those show within an hour.
export const revalidate = 3600

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteConfigProvider config={config}>
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
        </SiteConfigProvider>
      </body>
    </html>
  );
}
