import { BreadcrumbItem } from "@/types";
import { Category, Paginated, Transaction } from "@/types/models";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Head } from "@inertiajs/react";
import { TRANSACTIONS_TABLE_COLUMNS } from "@/lib/table-columns";
import { TRANSACTIONS_TABLE_FILTERS } from "@/lib/table-filters";
import AppLayout from "@/layouts/app-layout";
import CreateTransactionFormSheet from "@/components/forms/create-transaction-form";
import DataTable from "@/components/data-table";
import Heading from "@/components/heading";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Transactions",
        href: "/transactions",
    },
];

export default function Transactions({
    transactions,
    categories,
}: { transactions: Paginated<Transaction>; categories: Category[] }) {
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
                    <CreateTransactionFormSheet categories={categories}/>
                </div>
                <DataTable table={table} data={transactions} filters={TRANSACTIONS_TABLE_FILTERS}/>
            </div>
        </AppLayout>
    );
}
