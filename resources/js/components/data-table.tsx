import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { Fragment, useState } from "react";
import { Input } from "@/components/ui/input";
import { isEmpty, isEqual, isFunction } from "lodash";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { router, useForm } from "@inertiajs/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Paginated } from "@/types/models";
import { type TableFilter } from "@/types";
import useAuth from "@/hooks/use-auth";

/**
 * @todo
 * 1. Make this component more generic. It doesn't always have to be paginated or filterable.
 */
export default function DataTable<T>({ table, data, filters, className }: { table: ReactTable<T>; data: Paginated<T>; filters?: TableFilter[]; className?: string }) {
    return (
        <>
            { filters && (
                <div className="flex items-center py-2 justify-between">
                    <DataTableFilters filters={filters} tableData={data} />
                </div>
            )}
            <div className={cn("border rounded-xl h-full overflow-y-scroll bg-card", className)}>
                <div className="w-full max-h-72 p-4 pt-0">
                    <Table>
                        <TableHeader className="sticky top-0 p-4 bg-card">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="font-extrabold p-4">
                                                {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                                ))}
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.options.columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                        {table.getRowModel().rows?.length > 0 && table.getRowModel().rows.length < 20 && (
                            <TableRow>
                                <TableCell colSpan={table.options.columns.length} className="h-24 text-center">
                                    No more rows to show.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>   
            </div>
            { filters && (
                <div className="text-muted-foreground text-sm">
                    Showing {table.getFilteredRowModel().rows.length} item(s) out of {data.meta.total}
                </div>
            )}
        </>
    );
}

/**
 * @todo
 * 1. Make this responsive
 */
export function DataTableFilters<T>({ tableData, filters }: { tableData?: Paginated<T>, filters?: TableFilter[] }) {
    const user = useAuth();
    const [isFiltering, setIsFiltering] = useState(false);

    const params = new URLSearchParams(window.location.search);

    /**
     * @todo
     * 1. filters property should be REQUIRED
     */
    const defaultValues = filters?.reduce<Record<string, string>>(
        (acc, { key, defaultValue }) => ({
            ...acc,
            [key]: params.get(key) ?? (isFunction(defaultValue) ? defaultValue({ user }) : defaultValue) ?? ""
        }),
        tableData ? { page: "1" } : {}
    ) ?? {};

    const hasParams = Array.from(params.keys()).length > 0;
    const hasNonEmptyDefault = Object.entries(defaultValues).some(
        ([key, value]) => key !== "page" && value !== ""
    );

    if (!hasParams && hasNonEmptyDefault) {
        router.get(window.location.pathname, defaultValues, {
            replace: true,
            preserveState: true,
        });
    }

    /**
     * Used simply for state management instead of manually building the form state
     */
    const { data, setData, reset } = useForm(defaultValues);

    const handleApplyFilter = (key: string, value: string) => {
        setIsFiltering(true);
        setData(key, value);

        /**
         * Removes object properties that has empty values
         */
        const _data = Object.fromEntries(
            Object.entries({ ...data, [key]: value })
                .filter(([, v]) => !isEmpty(v))
            );

        if (tableData && !isEqual(key, "page")) {
            _data.page = "1";
        }

        /**
         * Opted to use pathname here instead of Inertia's usePage
         * because the url property caches the stale query parameters
         */
        router.get(window.location.pathname, _data, {
            replace: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false)
        });
    }

    return (
        <>
            <div className="flex items-center justify-start space-x-2">
                {filters?.map((filter) => {
                    if (filter.type === "searchBar") {
                        return <Input
                            key={filter.key}
                            placeholder={filter.placeholder}
                            className="w-96"
                            value={data[filter.key]}
                            onChange={(e) => handleApplyFilter(filter.key, e.target.value)}
                        />;
                    }

                    if (filter.type === "select") {
                        return (
                            <Select
                                key={filter.key}
                                value={data[filter.key]}
                                onValueChange={(value) => handleApplyFilter(filter.key, value)}
                                required
                                disabled={isFiltering}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder={filter.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filter.options.map((option) => 
                                        <SelectItem
                                            value={option.value}
                                            key={option.value}
                                        >
                                            {option.title}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        );
                    }

                    if (filter.type === "custom") {
                        return (
                            <Fragment key={filter.key}>
                                {filter.component({ isFiltering, value: data[filter.key], handleApplyFilter })}
                            </Fragment>
                        )
                    }
                })}
                { filters && (
                    <Button variant="ghost" size="icon" onClick={() => {
                        reset();
                        router.visit(window.location.pathname);
                    }}>
                        <X/>
                    </Button>
                )}
            </div>
            {/*
                @todo
                1. Make this responsive, show max 5 page numbers at a time
            */}
            { tableData && (
                <Pagination className="justify-end">
                    <PaginationContent>
                        {tableData.meta.links.map((link, i) => {
                            const isFirst = i === 0;
                            const isLast = i === tableData.meta.links.length - 1;
                            const isPage = !isFirst && !isLast;

                            return (
                                <PaginationItem key={i}>
                                {isFirst && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleApplyFilter("page", (tableData.meta.current_page - 1).toString())}
                                        disabled={tableData.meta.current_page === 1}
                                    >
                                        <ChevronLeftIcon />
                                    </Button>
                                )}

                                {isPage && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleApplyFilter("page", link.label)}
                                        className="hidden 2xl:block"
                                    >
                                        {link.label}
                                    </Button>
                                
                                )}

                                {isLast && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleApplyFilter("page", (tableData.meta.current_page + 1).toString())}
                                        disabled={tableData.meta.current_page === tableData.meta.last_page}
                                    >
                                        <ChevronRightIcon />
                                    </Button>
                                )}
                                </PaginationItem>
                            );
                        })}
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
}
