import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWhatsAppLink(message: string) {
  const phone = "2348000000000";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
