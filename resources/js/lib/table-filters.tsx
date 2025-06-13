import { TableFilter } from "@/types";
import { AccountType, Currency } from "./enums";
import { startCase, toUpper } from "lodash";

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
