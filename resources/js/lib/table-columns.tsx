import { ACCOUNT_TYPE_ICON_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatAmount } from "@/lib/utils";
import { isEqual } from "lodash";
import { Link } from "@inertiajs/react";
import { MoreHorizontal } from "lucide-react";
import { SheetTrigger } from "@/components/ui/sheet";
import { TransactionType } from "@/lib/enums";
import { type Transaction, type Account } from "@/types/models";
import * as Flags from "country-flag-icons/react/3x2";
import EditAccountFormSheet from "@/components/forms/edit-account-form";

export const ACCOUNTS_TABLE_COLUMNS: ColumnDef<Account>[] = [
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
        cell: ({ row }) => {
            return (
                <EditAccountFormSheet
                    account={row.original}
                    trigger={
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" aria-describedby="">
                                <SheetTrigger asChild>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                </SheetTrigger>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/transactions?account=${row.original.id}`}>
                                        View Transactions
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                />
            )
        },
    },
];

export const TRANSACTIONS_TABLE_COLUMNS: ColumnDef<Transaction>[] = [
    {
        accessorKey: "transacted_at",
        header: "Date"
    },
     {
        accessorKey: "account.type",
        header: "Account",
        cell: ({ row }) => {
            const Icon = ACCOUNT_TYPE_ICON_MAP[row.original.account.type];

            return (
                <div className="flex gap-2">
                    <Icon className="bg-sidebar-accent rounded-xl p-1 h-6 w-6"/>
                    {row.original.account.name}
                </div>
            );
        }
    },
    {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => {
            const _Flags: Record<string, Flags.FlagComponent> = Flags;
            const countryCode = "PH";
            const Flag = _Flags[countryCode]

            return (
                <div className="flex gap-2">
                    <Flag className="w-5 rounded-sm"/>
                    {row.original.account.currency}
                </div>
            )
        }
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <p className={
                isEqual(row.original.type, TransactionType.EXPENSE) ? "text-red-600" : "text-green-600"
            }>
                {formatAmount(row.getValue("amount"), row.original.account.currency)}
            </p>
        )
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "note",
        header: "Note",
    },
    {
        id: "actions",
        cell: () => {
            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" aria-describedby="">
                        {/* <SheetTrigger asChild>
                            <Button size="lg">
                                Edit Account
                            </Button>
                        </SheetTrigger> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Transactions</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                // <EditAccountFormSheet
                //     account={row.original}
                //     trigger={
                //         <DropdownMenu modal={false}>
                //             <DropdownMenuTrigger asChild>
                //                 <Button variant="ghost" className="h-8 w-8 p-0">
                //                     <span className="sr-only">Open menu</span>
                //                     <MoreHorizontal className="h-4 w-4" />
                //                 </Button>
                //             </DropdownMenuTrigger>
                //             <DropdownMenuContent align="end" aria-describedby="">
                //                 <SheetTrigger asChild>
                //                     <Button size="lg">
                //                         Edit Account
                //                     </Button>
                //                 </SheetTrigger>
                //                 <DropdownMenuSeparator />
                //                 <DropdownMenuItem>View Transactions</DropdownMenuItem>
                //             </DropdownMenuContent>
                //         </DropdownMenu>
                //     }
                // />
            )
        },
    },
];
