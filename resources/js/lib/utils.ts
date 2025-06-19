import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { Currency } from "@/lib/enums";
import { debounce } from "lodash";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatAmount(value: number, currency: Currency): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(value);
}

export function debounceCall(cb: (value: string) => void, seconds = 3000) {
    debounce(cb, seconds);
}