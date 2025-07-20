import { AccountType, Currency, TransactionType } from "@/lib/enums";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: number;
    name: string;
    type: AccountType;
    balance: number;
    currency: Currency;
    currency_country_code: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    amount: number;
    type: TransactionType;
    note: string|null;
    transacted_at: string;
    account: Account;
    category: string;
    running_balance: number;
    transfer_details?: Transfer;
}

export interface Transfer {
    id: number;
    from_account: Account;
    to_account: Account;
}

export interface Category {
    id: number;
    title: string;
}

interface Resource<T> {
    data: T[];
}

interface Paginated<T> extends Resource<T> {
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}