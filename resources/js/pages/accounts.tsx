import { ACCOUNT_TYPE_ICON_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatAmount } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { isNull } from "lodash";
import { MoreHorizontal } from "lucide-react";
import { Paginated, type Account } from "@/types/models";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type BreadcrumbItem } from "@/types";
import * as Flags from "country-flag-icons/react/3x2";
import AppLayout from "@/layouts/app-layout";

type AccountProps = {
    accounts: Paginated<Account>
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "My Accounts",
        href: "/accounts",
    },
];

const columns: ColumnDef<Account>[] = [
    {
        accessorKey: "type",
        header: "",
        cell: ({ row }) => {
            const Icon = ACCOUNT_TYPE_ICON_MAP[row.original.type];

            return <Icon className="bg-sidebar-accent rounded-xl p-1.5 h-8 w-8"/>
        }
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => {
            const _Flags: Record<string, Flags.FlagComponent> = Flags;
            const countryCode = (row.original.currency_country_code || "PH");
            const Flag = _Flags[countryCode]

            return (
                <div className="flex gap-2">
                    <Flag className="w-5 rounded-sm"/>
                    {row.getValue("currency")}
                </div>
            )
        }
    },
    {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => formatAmount(row.getValue("balance"), row.getValue("currency"))
    },
    {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText("")}
            >
              Edit Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Transactions</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

export default function Accounts({ accounts }: AccountProps) {
    const table = useReactTable<Account>({
        data: accounts.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Accounts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center">
                    <div className="flex items-center justify-start space-x-2 flex-1">
                        <Pagination>
                            <PaginationContent>
                                {accounts.meta.links.map((link, i) => {
                                    const isFirst = i === 0
                                    const isLast = i === accounts.meta.links.length - 1
                                    const isPage = !isFirst && !isLast

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
                    </div>
                </div>
                <div className="border rounded-xl p-4">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="font-bold">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                    </Table>
                </div>
                <div className="text-muted-foreground text-sm">
                        Showing {table.getFilteredRowModel().rows.length} item(s) out of {accounts.meta.total}
                    </div>
            </div>
        </AppLayout>
    );
}