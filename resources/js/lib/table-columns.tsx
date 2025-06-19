import { ACCOUNT_TYPE_ICON_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatAmount } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { type Account } from "@/types/models";
import * as Flags from "country-flag-icons/react/3x2";
import CreateAccountFormTrigger from "@/components/forms/create-account-form";

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    {/* Edit Account */}
                    <CreateAccountFormTrigger account={row.original}/>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Transactions</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];