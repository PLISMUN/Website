import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isPaid(status: unknown): boolean {
  return Boolean(status)
}

export function paymentStatusLabel(status: unknown): "Completed" | "Pending" {
  return isPaid(status) ? "Completed" : "Pending"
}

// Only follow ?next= to pages inside the portal, so the param can't be used as an open redirect
export function portalRedirect(next: string | null | undefined): string {
  return next && next.startsWith("/user/") && !next.startsWith("//") ? next : "/user/dashboard"
}
