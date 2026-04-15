import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um número removendo zeros desnecessários à direita
 * Exemplos: 9.00 -> "9", 9.50 -> "9.5", 9.05 -> "9.05"
 */
export function formatNumber(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, '');
}
