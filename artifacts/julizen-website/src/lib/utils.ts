import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWhatsAppLink(message: string, phone?: string) {
  const number = phone && phone.trim() ? phone.trim() : "2348033975366";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
