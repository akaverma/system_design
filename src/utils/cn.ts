import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with `clsx` (conditional classes) and `tailwind-merge`
 * (resolves conflicting Tailwind utility classes, last one wins).
 *
 * @example
 * ```ts
 * cn("px-2 py-1", isActive && "bg-primary", className)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
