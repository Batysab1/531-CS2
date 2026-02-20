import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

export const RANKS = [
  "Silver I", "Silver II", "Silver III", "Silver IV",
  "Silver Elite", "Silver Elite Master",
  "Gold Nova I", "Gold Nova II", "Gold Nova III", "Gold Nova Master",
  "Master Guardian I", "Master Guardian II",
  "Master Guardian Elite", "Distinguished Master Guardian",
  "Legendary Eagle", "Legendary Eagle Master",
  "Supreme Master First Class", "Global Elite"
];

export const RANK_COLORS: Record<string, string> = {
  "Global Elite": "#f5700a",
  "Supreme Master First Class": "#c9a84c",
  "Legendary Eagle Master": "#8b5cf6",
  "Legendary Eagle": "#8b5cf6",
  "Distinguished Master Guardian": "#3b82f6",
  "Master Guardian Elite": "#3b82f6",
  "Master Guardian II": "#2ebd85",
  "Master Guardian I": "#2ebd85",
};

export function getRankColor(rank: string): string {
  return RANK_COLORS[rank] || "#5a6475";
}
