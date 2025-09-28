import { Currency } from "@/lib/enums";
import { debounce, isEmpty } from "lodash";
import { REGEX } from "@/lib/constants";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatAmount(value: number, currency?: Currency): string {
    const config: Intl.NumberFormatOptions = {
        style: "decimal",
        maximumFractionDigits: 2,
    };

    if (currency) {
        config.style = "currency";
        config.currency = currency;
    }

    return new Intl.NumberFormat("en", config).format(value);
}

/**
 * Sanitizes and converts an amount string into float.
 * Returns 0 if the input is an invalid number.
 */
export function amountToFloat(value: string, decimalPlaces = 2): number {
    const str = value.replace(REGEX.INVALID_NUMERIC_CHAR, "");
    const parsed = parseFloat(str);

    return isNaN(parsed) ? 0 : round(parsed, decimalPlaces, "down");
}

export function round(number: number, decimalPlaces = 2, type: "up" | "down" | "standard" = "standard"): number {
    const factor = Math.pow(10, decimalPlaces);

    switch (type) {
        case "up": return Math.ceil(number * factor) / factor;
        case "down": return Math.floor(number * factor) / factor;
        default: return parseFloat(number.toFixed(decimalPlaces));
    };
}

export function formatDateToFriendly(value: string): string
{
    const date = new Date(value.replace(" ", "T"));

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
