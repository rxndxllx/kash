import { AccountType, TransactionType } from "@/lib/enums";
import { startCase } from "lodash";
import { TableFilter } from "@/types";
import SelectAccount from "@/components/select-account";
import SelectCategory from "@/components/select-category";
import SelectCurrency from "@/components/select-currency";

export const ACCOUNTS_TABLE_FILTERS: TableFilter[] = [
    {
        type: "searchBar",
        key: "search",
        placeholder: "Search"
    },
    {
        type: "custom",
        key: "currency",
        component: ({ value, isFiltering, handleApplyFilter }) => (
            <SelectCurrency
                value={value}
                disabled={isFiltering}
                onValueChange={(value) => handleApplyFilter("currency", value)}
            />
        )
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
                readableValue
                className="w-[200px] truncate"
            />
        ),
    },
    {
        type: "select",
        key: "type",
        options: Object.values(TransactionType).map((type) => ({
            title: startCase(type),
            value: type,
        })),
        placeholder: "Type"
    },
    {
        type: "custom",
        key: "currency",
        component: ({ value, isFiltering, handleApplyFilter }) => (
            <SelectCurrency
                value={value}
                disabled={isFiltering}
                onValueChange={(value) => handleApplyFilter("currency", value)}
            />
        )
    },
    {
        type: "custom",
        key: "category",
        component: ({ value, isFiltering, handleApplyFilter }) => (
            <SelectCategory
                value={value}
                onValueChange={(value) => handleApplyFilter("category", value)}
                disabled={isFiltering}
                readableValue
                className="w-[200px] truncate"
            />
        )
    },
];
