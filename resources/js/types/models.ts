import { AccountType, Currency, TransactionType } from "@/lib/enums";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    email_verified_at: string | null;
    gender: string;
    birthdate: string;
    country: string;
    base_currency: Currency;
    profile_picture: string;
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
    category: Category;
    running_balance: number;
    transfer_details?: Transfer;
}

export interface Transfer {
    id: number;
    from_account: Account;
    to_account: Account;
    transfer_fee: number | null;
}

export interface Category {
    id: number;
    title: string;
}

export interface DashboardStats {
    id: number;
    currency: Currency;
    month: number;
    year: number;
    total_balance: number;
    total_income: number;
    total_expense: number;
}

interface Resource<T> {
    data: T[];
}

export interface Paginated<T> extends Resource<T> {
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
