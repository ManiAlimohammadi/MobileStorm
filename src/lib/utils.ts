import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price * 1000) + " تومان";
}

export function formatPriceShort(price: number): string {
  if (price >= 1000) {
    return new Intl.NumberFormat("fa-IR").format(price / 1000) + " میلیون تومان";
  }
  return new Intl.NumberFormat("fa-IR").format(price) + " هزار تومان";
}

export function formatPriceCompact(price: number): string {
  const p = price * 1000;
  if (p >= 1_000_000) {
    const m = p / 1_000_000;
    return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(m) + " میلیون";
  }
  return new Intl.NumberFormat("fa-IR").format(p);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function getDiscount(original: number, selling: number): number {
  return Math.round(((original - selling) / original) * 100);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
