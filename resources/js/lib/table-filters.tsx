import { AccountType, TransactionType } from "@/lib/enums";
import { startCase } from "lodash";
import { TableFilter } from "@/types";
import dayjs from "dayjs";
import SelectAccount from "@/components/select-account";
import SelectCategory from "@/components/select-category";
import SelectCurrency from "@/components/select-currency";
import SelectMonth from "@/components/select-month";

export const ACCOUNTS_TABLE_FILTERS: TableFilter<"currency" | "type">[] = [
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

export const TRANSACTIONS_TABLE_FILTERS: TableFilter<"account" | "type" | "currency" | "category">[] = [
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

export const DASHBOARD_FILTERS: TableFilter<"currency" | "month" | "year">[] = [
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
        defaultValue: ({ user }) => user.base_currency,
    },
    {
        type: "custom",
        key: "month",
        component: ({ data, value, isFiltering, handleApplyFilter }) => {
            const selectedYear = parseInt(data.year);
            const selectedMonth = parseInt(value);
            const currentYear = dayjs().year();
            const currentMonth = dayjs().month() + 1;

            if (selectedYear === currentYear && selectedMonth > currentMonth) {
                handleApplyFilter("month", currentMonth.toString())
            }
            
            return (
                <SelectMonth
                    value={value}
                    disabled={isFiltering}
                    onValueChange={(value) => handleApplyFilter("month", value)}
                    showFuture={false}
                    year={data.year}
                />
            )
        },
        defaultValue: (dayjs().month() + 1).toString(),
    },
    {
        type: "select",
        key: "year",
        options: [
            { title: "2020", value: "2020" },
            { title: "2021", value: "2021" },
            { title: "2022", value: "2022" },
            { title: "2023", value: "2023" },
            { title: "2024", value: "2024" },
            { title: "2025", value: "2025" },
        ],
        placeholder: "Year",
        defaultValue: (dayjs().year()).toString(),
    },
];
