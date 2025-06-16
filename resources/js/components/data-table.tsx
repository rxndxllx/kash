import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Paginated } from "@/types/models";
import { TableFilter } from "@/types";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toUpper, isNull } from "lodash";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "./ui/pagination";

export default function DataTable<T>({ table, data, filters }: { table: ReactTable<T>; data: Paginated<T>; filters: TableFilter[] }) {
    return (
        <>
        <div className="flex items-center py-2 justify-between">
            <DataTableFilters filters={filters} />
            <DataTablePagination data={data} />
        </div>
            <div className="border rounded-xl h-full overflow-y-scroll">
                <div className="w-full max-h-72 p-4 pt-0">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background p-4">
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
                        {table.getRowModel().rows?.length < 20 && (
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
            <div className="text-muted-foreground text-sm">
                    Showing {table.getFilteredRowModel().rows.length} item(s) out of {data.meta.total}
            </div>
        </>
    );
}

/**
 * @todo
 * 1. Add a "clear filter" button
 * 2. Make this responsive
 * 3. Add functionality
 */
function DataTableFilters({ filters }: { filters: TableFilter[] }) {
    return (
        <div className="flex items-center justify-start space-x-2">
            {filters.map((filter) => {
                if (filter.type === "searchBar") {
                    return <Input placeholder={filter.placeholder} className="w-96" />;
                }

                if (filter.type === "select") {
                    return (
                        <Select>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.options.map((option) => 
                                    <SelectItem
                                        value={option.value}
                                        key={option.value}
                                    >
                                        {toUpper(option.title)}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    );
                }
            })}
        </div>
    );
}

/**
 * @todo
 * 1. Limit the page numbers shown
 */
function DataTablePagination<T>({ data }: { data: Paginated<T> }) {
    return (
        <Pagination className="justify-end">
            <PaginationContent>
                {data.meta.links.map((link, i) => {
                    const isFirst = i === 0;
                    const isLast = i === data.meta.links.length - 1;
                    const isPage = !isFirst && !isLast;

                    return (
                        <PaginationItem key={i}>
                        {isFirst && (
                            <PaginationPrevious
                                href={link.url || "#"}
                                disabled={isNull(link.url)}
                            />
                        )}

                        {isPage && (
                            <PaginationLink
                                href={link.url || "#"}
                                isActive={link.active}
                                disabled={isNull(link.url)}
                                className="hidden 2xl:block"
                            >
                                {link.label}
                            </PaginationLink>
                        )}

                        {isLast && (
                            <PaginationNext
                                href={link.url || "#"}
                                disabled={isNull(link.url)}
                            />
                        )}
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    )
}