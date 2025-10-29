import { JSX } from "react";
import { LucideIcon } from "lucide-react";
import { User } from "@/types/models";
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

export interface BaseTableFilter<K> {
    key: K;
    defaultValue?: string|((props: { user: User; }) => string);
}

interface SelectTableFilter<K> extends BaseTableFilter<K> {
    type: "select";
    placeholder: string;
    options: {
        title: string;
        value: string;
    }[];
    disabled?: (args: { data: Record<string, string>, value: string }) => boolean;
}

interface SearchBarTableFilter extends BaseTableFilter<"search"> {
    type: "searchBar";
    placeholder: string;
    key: "search";
}

interface CustomTableFilter<K extends string> extends BaseTableFilter<K> {
    type: "custom";
    component: (props: {data: FilterData<K>, isFiltering: boolean; value: string; handleApplyFilter: (key: FilterKeys<K>, value: string) => void }) => JSX.Element;
}

export type TableFilter<K extends string = string> = SearchBarTableFilter | SelectTableFilter<K> | CustomTableFilter<K>;
export type FilterKeys<K> = K | "page" | "search";
export type FilterData<K extends string> = Record<FilterKeys<K>, string>;
