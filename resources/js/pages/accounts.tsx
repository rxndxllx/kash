import { ACCOUNT_TYPE_ICON_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatAmount } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { isNull } from "lodash";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, CircleFadingPlus } from "lucide-react";
import { Paginated, type Account } from "@/types/models";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        My Accounts
                    </h2>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="lg">
                                Create New
                                <CircleFadingPlus height={8} width={8}/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </SheetDescription>
                            </SheetHeader>
                            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-demo-name">Name</Label>
                                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-demo-username">Username</Label>
                                <Input id="sheet-demo-username" defaultValue="@peduarte" />
                            </div>
                            </div>
                            <SheetFooter>
                            <Button type="submit">Save changes</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="flex items-center py-2 justify-between">
                    <div className="flex items-center justify-start space-x-2">
                        <Input placeholder="Search" className="w-96 lg:w-[500px]"/>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Pagination className="justify-end">
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
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                            {table.getRowModel().rows?.length < 20 && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No more rows to show.
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </div>   
                </div>
                <div className="text-muted-foreground text-sm">
                        Showing {table.getFilteredRowModel().rows.length} item(s) out of {accounts.meta.total}
                    </div>
            </div>
        </AppLayout>
    );
}