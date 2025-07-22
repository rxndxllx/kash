import { ACCOUNT_TYPE_ICON_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatAmount, formatDateToFriendly } from "@/lib/utils";
import { isEqual } from "lodash";
import { Link } from "@inertiajs/react";
import { MoreHorizontal } from "lucide-react";
import { SheetTrigger } from "@/components/ui/sheet";
import { TransactionType } from "@/lib/enums";
import { type Transaction, type Account } from "@/types/models";
import EditAccountFormSheet from "@/components/forms/edit-account-form";
import Flag from "@/components/flag";

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
            return (
                <div className="flex gap-2">
                    <Flag countryCode={row.original.currency_country_code }/>
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
        header: "Date",
        cell: ({ row }) => formatDateToFriendly(row.getValue("transacted_at"))
    },
     {
        accessorKey: "account",
        header: "Account",
        cell: ({ row }) => {
            const Icon = ACCOUNT_TYPE_ICON_MAP[row.original.account.type];

            if (row.original.transfer_details) {
                const transferDetails = row.original.transfer_details;
                const isFrom = isEqual(row.original.account.id, transferDetails.from_account.id);

                return (
                     <div className="flex gap-2 items-center">
                        <Icon className="bg-sidebar-accent rounded-xl p-1 h-6 w-6"/>
                        {row.original.account.name}{" "}
                        {
                            isFrom
                                ? `→ ${transferDetails.to_account.name}`
                                : `← ${transferDetails.from_account.name}`
                        }
                    </div>
                )
            }

            return (
                <div className="flex gap-2 items-center">
                    <Icon className="bg-sidebar-accent rounded-xl p-1 h-6 w-6"/>
                    <span>{row.original.account.name}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <Flag countryCode={row.original.account.currency_country_code}/>
                    {row.original.account.currency}
                </div>
            )
        }
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const textColor = isEqual(row.original.type, TransactionType.EXPENSE)
                ? "text-red-600"
                : isEqual(row.original.type, TransactionType.INCOME)
                    ? "text-green-600"
                    : "";

             const isDebit = isEqual(row.original.type, TransactionType.EXPENSE)
                || isEqual(row.original.account.id, row.original.transfer_details?.from_account.id);

            return (
                <p className={textColor}>
                    {isDebit ? "-" : "+"}{formatAmount(row.getValue("amount"), row.original.account.currency)}
                </p>
        )}
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "running_balance",
        header: "Balance",
        cell: ({ row }) => formatAmount(row.getValue("running_balance"), row.original.account.currency)
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
