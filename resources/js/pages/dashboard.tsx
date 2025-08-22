import { AccountType, Currency, TransactionType } from "@/lib/enums";
import { ArrowLeftRight, Banknote, BetweenVerticalStart, ChartNoAxesColumn, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarMixed } from "@/components/chart-bar-mixed";
import { ChartBarStacked } from "@/components/chart-bar-stacked-legend";
import { DASHBOARD_TRANSACTIONS_TABLE_COLUMNS } from "@/lib/table-columns";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Head } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type BreadcrumbItem } from "@/types";
import { type Transaction } from "@/types/models";
import AppLayout from "@/layouts/app-layout";
import DataTable from "@/components/data-table";
import Flag from "@/components/flag";
import Heading from "@/components/heading";
import SelectCurrency from "@/components/select-currency";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
];

const dummy = {
    data: [{
        id: 1,
        amount: 1000,
        type: TransactionType.EXPENSE,
        note: null,
        transacted_at: "2025-08-22 20:12:00",
        account: {
            id: 1,
            name: "Sample",
            type: AccountType.SAVINGS_ACCOUNT,
            balance: 1000,
            currency: Currency.USD,
            currency_country_code: "US",
            created_at: "2025-08-22 20:12:00",
            updated_at: "2025-08-22 20:12:00",
        },
        category: {
            id: 1,
            title: "Sample",
        },
        running_balance: 1000,
    }],
    links: {
        first: "",
        last: "",
        prev: null,
        next: null,
    },
    meta: {
        current_page: 1,
        from: 1,
        last_page: 5,
        path: "string",
        per_page: 10,
        to: 2,
        total: 20,
        links: [{
            url: null,
            label: "5",
            active: false,
        }],
    }
};

export default function Dashboard() {
    const table = useReactTable<Transaction>({
        data: dummy.data,
        columns: DASHBOARD_TRANSACTIONS_TABLE_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between">
                    <div className="flex justify-between items-center">
                        <Heading title="Dashboard" description="A quick peek into your finances" />
                    </div>
                    <DashboardFilters />
                </div>
                <div className="grid gap-4 xl:grid-cols-3 xl:grid-rows-2 flex-2">
                    <Card className="size-full row-span-2 shadow-sm shadow-chart-2">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                                <CardTitle className="flex items-center gap-2"><Banknote /> Balance</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="size-full flex items-center">
                            <div className="flex flex-col gap-4">
                                <h2 className="scroll-m-20 text-4xl font-black tracking-tight first:mt-0">$3,500,500.00</h2>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex">
                                    <Flag countryCode="US" className="w-5 mr-2"/>
                                    <span>US Dollar</span>    
                                </div>
                            <div className="flex gap-2 leading-none font-medium">
                                Trending up by 5.2% from last month <TrendingUp className="h-4 w-4" />
                            </div>
                        </CardFooter>
                    </Card>
                    <Card className="size-full row-span-2">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="flex items-center gap-2"><ArrowLeftRight />Cash Flow</CardTitle>
                        </CardHeader>
                        <CardContent className="size-full flex flex-col justify-evenly">
                            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">$1,000.00</h2>
                            <ChartBarMixed />
                        </CardContent>
                    </Card>
                    <div className="col-span-1 row-span-2 grid gap-4">
                        <Card className="row-span-1 bg-chart-2 text-primary-foreground">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><ChartNoAxesColumn />Top Income</CardTitle>
                            </CardHeader>
                            <CardContent className="size-full flex flex-col">
                                <div className="flex">
                                    <ol className="list-inside pt-3 w-full">
                                        <li>
                                            <div className="flex justify-between items-center">
                                                <p>Housing</p>
                                                <span>40%</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex justify-between items-center">
                                                <p>Pets</p>
                                                <span>20%</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex justify-between items-center">
                                                <p>Health & Medicine</p>
                                                <span>15%</span>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="row-span-1 bg-chart-4 text-primary-foreground">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><ChartNoAxesColumn />Top Expenses</CardTitle>
                            </CardHeader>
                            <CardContent className="size-full flex flex-col">
                                <div className="flex">
                                    <ol className="list-inside pt-3 w-full">
                                        <li>
                                            <div className="flex justify-between items-center">
                                                <p>Housing</p>
                                                <span>40%</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex justify-between items-center">
                                                <p>Pets</p>
                                                <span>20%</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex justify-between items-center">
                                                <p>Health & Medicine</p>
                                                <span>15%</span>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex-2 grid xl:grid-cols-12 gap-4">
                    <div className="xl:col-span-7 rounded-xl">
                        <ChartBarStacked />
                    </div>
                    <Card className="xl:col-span-5 border px-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BetweenVerticalStart />Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent className="size-full flex flex-col px-0">
                            <DataTable table={table} data={dummy} className="rounded-none border-none"/>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function DashboardFilters() {
    return (
        <div className="flex gap-2">
            <SelectCurrency />
            <Select
                value=""
                onValueChange={(value) => console.log(value)}
                required
            >
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">
                        Test
                    </SelectItem>
                </SelectContent>
            </Select>
            <Select
                value=""
                onValueChange={(value) => console.log(value)}
                required
            >
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">
                        Test
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
