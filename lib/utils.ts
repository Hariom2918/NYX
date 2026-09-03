import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format paise amount to INR display string.
 * 49900 → "₹499"
 */
export function formatCurrency(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Format ISO date to readable string.
 * "2026-09-27T19:00:00+05:30" → "September 27, 2026 at 7:00 PM"
 */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(isoDate));
}

/**
 * Format ISO date to short date only.
 * "2026-09-27T19:00:00+05:30" → "Sep 27, 2026"
 */
export function formatShortDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(isoDate));
}
