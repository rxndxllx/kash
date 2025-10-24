import { ACCOUNTS_TABLE_COLUMNS } from "@/lib/table-columns";
import { ACCOUNTS_TABLE_FILTERS } from "@/lib/table-filters";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontal } from "lucide-react";
import { Paginated, type Account } from "@/types/models";
import { toast } from "sonner";
import { type BreadcrumbItem } from "@/types";
import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import CreateAccountFormSheet from "@/components/forms/create-account-form";
import DataTable from "@/components/data-table";
import EditAccountFormSheet from "@/components/forms/edit-account-form";
import Heading from "@/components/heading";

type AccountProps = {
    accounts: Paginated<Account>
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "My Accounts",
        href: "/accounts",
    },
];

export default function Accounts({ accounts }: AccountProps) {
    const [openForm, setOpenForm] = useState(false);

    const table = useReactTable<Account>({
        data: accounts.data,
        columns: ACCOUNTS_TABLE_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setOpenForm(!!params.get("new"));
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Accounts" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <Heading title="My Accounts" description="View and manage all your linked accounts in one place" />
                    <CreateAccountFormSheet open={openForm} setOpen={setOpenForm}/>
                </div>
                <DataTable table={table} data={accounts} filters={ACCOUNTS_TABLE_FILTERS} />
            </div>
        </AppLayout>
    );
}

export function AccountsTableActionPanel({ account }: { account: Account }) {
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleDeleteAccount = () => {
        router.delete(route("delete-account", { id: account.id }), {
            onSuccess: () => {
                setOpenDeleteDialog(false);
                toast("Account deleted", {
                    closeButton: true,
                    position: "top-center",
                    description: `Successfully deleted account ${account.name}.`
                });
            }
        })
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" aria-describedby="">
                    <DropdownMenuItem onClick={() => setOpenEditForm(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>Delete</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/transactions?account=${account.name}`}>
                            View Transactions
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditAccountFormSheet account={account} open={openEditForm} setOpen={setOpenEditForm} />

            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent>
                    <DialogTitle>Are you sure you want to delete account {account.name}?</DialogTitle>
                    <DialogDescription>
                        Once this account is deleted, all of its transactions and data will also be deleted. <b>This action cannot be reversed</b>.
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}