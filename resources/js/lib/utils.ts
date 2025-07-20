import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { Currency } from "@/lib/enums";
import { debounce, isEmpty } from "lodash";

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

export function formatDateToFriendly(value: string): string
{
    const date = new Date(value.replace(" ", "T")); // Convert to ISO format

    const formatted = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);

    return formatted;
}

export function debounceCall(cb: (value: string) => void, seconds = 3000) {
    debounce(cb, seconds);
}

export function parseIntOrSelf(value: string): number | string {
    return isEmpty(value) ? value : parseInt(value);
}