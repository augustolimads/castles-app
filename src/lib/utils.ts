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

export function selectAllText(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
}

export function formatAttributeModifier(value: number): string {
    if (value >= 18) {
        return "+3";
    } else if (value >= 16) {
        return "+2";
    } else if (value >= 13) {
        return "+1";
    } else if (value >= 9) {
        return "0";
    } else if (value >= 6) {
        return "-1";
    } else if (value >= 4) {
        return "-2";
    } else {
        return "-3";
    }
}