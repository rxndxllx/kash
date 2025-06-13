import { ACCOUNTS_TABLE_COLUMNS } from "@/lib/table-columns";
import { ACCOUNTS_TABLE_FILTERS } from "@/lib/table-filters";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Head } from "@inertiajs/react";
import { Paginated, type Account } from "@/types/models";
import { type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import CreateAccountFormTrigger from "@/components/forms/create-account-form";
import DataTable from "@/components/data-table";
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
    const table = useReactTable<Account>({
        data: accounts.data,
        columns: ACCOUNTS_TABLE_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Accounts" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <Heading title="My Accounts" description="View and manage all your linked accounts in one place" />
                    <CreateAccountFormTrigger />
                </div>
                <DataTable table={table} data={accounts} filters={ACCOUNTS_TABLE_FILTERS}/>
            </div>
        </AppLayout>
    );
}