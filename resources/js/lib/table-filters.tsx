import { AccountType, Currency, TransactionType } from "@/lib/enums";
import { startCase, toUpper } from "lodash";
import { TableFilter } from "@/types";
import SelectAccount from "@/components/select-account";

export const ACCOUNTS_TABLE_FILTERS: TableFilter[] = [
    {
        type: "searchBar",
        key: "search",
        placeholder: "Search"
    },
    {
        type: "select",
        key: "currency",
        options: Object.values(Currency).map((currency) => ({
            title: toUpper(currency),
            value: currency,
        })),
        placeholder: "Currency"
    },
    {
        type: "select",
        key: "type",
        options: Object.values(AccountType).map((type) => ({
            title: startCase(type),
            value: type,
        })),
        placeholder: "Type"
    }
];

export const TRANSACTIONS_TABLE_FILTERS: TableFilter[] = [
    {
        type: "custom",
        key: "account",
        component: ({ value, isFiltering, handleApplyFilter }) => (
            <SelectAccount
                value={value}
                onValueChange={(value) => handleApplyFilter("account", value)}
                disabled={isFiltering}
            />
        ),
    },
    {
        type: "select",
        key: "type",
        options: Object.values(TransactionType).map((type) => ({
            title: toUpper(type),
            value: type,
        })),
        placeholder: "Type"
    },
    {
        type: "select",
        key: "currency",
        options: Object.values(Currency).map((currency) => ({
            title: toUpper(currency),
            value: currency,
        })),
        placeholder: "Currency"
    },
];
