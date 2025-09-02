import { AccountType, Currency, TransactionType } from "@/lib/enums";
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

export const DASHBOARD_FILTERS: TableFilter[] = [
    {
        type: "custom",
        key: "currency",
        component: ({ value, isFiltering, handleApplyFilter }) => (
            <SelectCurrency
                value={value}
                disabled={isFiltering}
                onValueChange={(value) => handleApplyFilter("currency", value)}
            />
        ),
        defaultValue: Currency.USD,
    },
    {
        type: "select",
        key: "month",
        options: [
            { title: "January", value: "1" },
            { title: "February", value: "2" },
            { title: "March", value: "3" },
            { title: "April", value: "4" },
            { title: "May", value: "5" },
            { title: "June", value: "6" },
            { title: "July", value: "7" },
            { title: "August", value: "8" },
            { title: "September", value: "9" },
            { title: "October", value: "10" },
            { title: "November", value: "11" },
            { title: "December", value: "12" },
        ],
        placeholder: "Month",
        defaultValue: "1",
    },
    {
        type: "select",
        key: "year",
        options: [
            { title: "2025", value: "2025" },
        ],
        placeholder: "Year",
        defaultValue: "2025",
    },

];
