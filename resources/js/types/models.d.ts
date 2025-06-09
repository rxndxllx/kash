import { AccountType, Currency } from "@/lib/enums";

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
    currency_country_code?: string;
    created_at: string;
    updated_at: string;
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