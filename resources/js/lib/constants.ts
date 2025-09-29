import { AccountType, Currency, TransactionType } from "@/lib/enums";
import { Banknote, Landmark, PiggyBank, WalletMinimal } from "lucide-react";

export const REGEX = {
    /**
     * Matches a valid positive decimal:
     * - Integers (e.g. "123")
     * - Decimals with leading dot (e.g. ".45")
     * - Decimals with trailing dot (e.g. "123.")
     * - Decimals with digits on both sides (e.g. "123.45")
     *
     * Does not allow negatives, empty string, or multiple dots.
     */
    POSITIVE_DECIMAL: /^(?:\d+\.\d*|\.\d+|\d+)$/,

    /**
     * Matches any character that is not a digit, decimal point, or hyphen.
     * Useful for stripping out invalid characters from numeric input.
     */
    INVALID_NUMERIC_CHAR: /[^\d.-]/g,
};

export const ACCOUNT_TYPE_ICON_MAP = {
    [AccountType.CASH]: Banknote,
    [AccountType.CHECKING_ACCOUNT]: Landmark,
    [AccountType.E_WALLET]: WalletMinimal,
    [AccountType.SAVINGS_ACCOUNT]: PiggyBank
};

export const CURRENCY_COUNTRY_CODE_MAP = {
    [Currency.PHP]: "PH",
    [Currency.USD]: "US",
};

export const TRANSACTION_TYPE_COLOR_MAP = {
    [TransactionType.EXPENSE]: "text-red-600",
    [TransactionType.INCOME]: "text-green-600",
    [TransactionType.TRANSFER]: "",
}
