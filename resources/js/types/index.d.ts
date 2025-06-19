import { LucideIcon } from "lucide-react";
import { User } from "@types/models";
import type { Config } from "ziggy-js";

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & {
        location: string;
        query: Record<string, string|[]>
    };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface BaseTableFilter {
    key: string;
    placeholder: string;
}

interface SelectTableFilter extends BaseTableFilter {
    type: "select";
    options: {
        title: string;
        value: string;
    }[];
}

interface SearchBarTableFilter extends BaseTableFilter {
    type: "searchBar";
    key: "search";
}

export type TableFilter = SearchBarTableFilter | SelectTableFilter;
