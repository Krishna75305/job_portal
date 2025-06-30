import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  // return classes.filter(Boolean).join(' ');
  return twMerge(clsx(...inputs));
}
