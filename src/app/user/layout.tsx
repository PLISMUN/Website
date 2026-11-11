// The portal and sign-in pages are built on every request rather than cached like the rest of the site, since
// they show each person their own data. The settings they read still come from the cache (getSiteConfig).
export const dynamic = "force-dynamic"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return children
}
