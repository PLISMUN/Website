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
