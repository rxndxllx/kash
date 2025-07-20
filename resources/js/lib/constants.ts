import { AccountType, Currency } from "@/lib/enums";
import { Banknote, Landmark, PiggyBank, WalletMinimal } from "lucide-react";

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
