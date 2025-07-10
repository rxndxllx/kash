import DataTable from "@/components/data-table";
import CreateTransactionFormSheet from "@/components/forms/create-transaction-form";
import Heading from "@/components/heading";
import AppLayout from "@/layouts/app-layout";
import { TRANSACTIONS_TABLE_COLUMNS } from "@/lib/table-columns";
import { BreadcrumbItem } from "@/types";
import { Paginated, Transaction } from "@/types/models";
import { Head } from "@inertiajs/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Transactions",
        href: "/transactions",
    },
];

export default function Transactions({ transactions }: { transactions: Paginated<Transaction>}) {
    const table = useReactTable<Transaction>({
        data: transactions.data,
        columns: TRANSACTIONS_TABLE_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <Heading title="Transactions" description="View and manage all your transactions in one place" />
                    <CreateTransactionFormSheet />
                </div>
                <DataTable table={table} data={transactions} />
            </div>
        </AppLayout>
    );
}
