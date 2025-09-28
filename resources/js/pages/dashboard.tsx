import { ArrowLeftRight, Banknote, BetweenVerticalStart, ChartNoAxesColumn, CircleFadingPlus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarMixed } from "@/components/chart-bar-mixed";
import { ChartBarStacked } from "@/components/chart-bar-stacked-legend";
import { DASHBOARD_FILTERS } from "@/lib/table-filters";
import { DASHBOARD_TRANSACTIONS_TABLE_COLUMNS } from "@/lib/table-columns";
import { DashboardStats, Paginated, type Transaction } from "@/types/models";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatAmount } from "@/lib/utils";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Head, Link } from "@inertiajs/react";
import { TransactionType } from "@/lib/enums";
import { type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import DataTable, { DataTableFilters } from "@/components/data-table";
import Flag from "@/components/flag";
import Heading from "@/components/heading";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
];

type DashboardProps = {
    yearly_data: DashboardStats[];
    monthly_data: DashboardStats & {
        cash_flow: number;
        top_incomes: { category: string; percentage: number; total_amount: number }[];
        top_expenses: { category: string; percentage: number; total_amount: number }[];
     };
    recent_transactions: Paginated<Transaction>;
}

export default function Dashboard({ yearly_data, monthly_data, recent_transactions }: DashboardProps) {
    const table = useReactTable<Transaction>({
        data: recent_transactions.data,
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
                    <div className="flex items-center gap-2">
                        <DataTableFilters filters={DASHBOARD_FILTERS} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="lg">
                                    Create New
                                    <CircleFadingPlus height={8} width={8}/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/accounts?new=true">Account</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/transactions?new=true">Transaction</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
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
                                <h2 className="scroll-m-20 text-4xl font-black tracking-tight first:mt-0">
                                    {formatAmount(monthly_data.total_balance, monthly_data.currency)}
                                </h2>
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
                            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                                {formatAmount(monthly_data.cash_flow, monthly_data.currency)}
                            </h2>
                            <ChartBarMixed data={[
                                { type: TransactionType.INCOME, total: monthly_data.total_income, fill: "var(--chart-2)" },
                                { type: TransactionType.EXPENSE, total: monthly_data.total_expense, fill: "var(--chart-4)" },
                            ]}/>
                        </CardContent>
                    </Card>
                    <div className="col-span-1 row-span-2 grid gap-4">
                        <Card className="row-span-1 bg-chart-2 text-primary-foreground min-h-44">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><ChartNoAxesColumn />Top Income</CardTitle>
                            </CardHeader>
                            <CardContent className="size-full flex flex-col">
                                <div className="flex">
                                    <ol className="list-inside pt-3 w-full">
                                        { monthly_data.top_incomes.length > 0
                                            ? (monthly_data.top_incomes.map((income) => 
                                                <li>
                                                    <div className="flex justify-between items-center">
                                                        <p>{income.category}</p>
                                                        <span>{income.percentage}%</span>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li>
                                                    <div className="flex justify-center items-center">
                                                        <p>No data.</p>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="row-span-1 bg-chart-4 text-primary-foreground min-h-44">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><ChartNoAxesColumn />Top Expenses</CardTitle>
                            </CardHeader>
                            <CardContent className="size-full flex flex-col">
                                <div className="flex">
                                    <ol className="list-inside pt-3 w-full">
                                        { monthly_data.top_expenses.length > 0
                                            ? (monthly_data.top_expenses.map((income) => 
                                                <li>
                                                    <div className="flex justify-between items-center">
                                                        <p>{income.category}</p>
                                                        <span>{income.percentage}%</span>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li>
                                                    <div className="flex justify-center items-center">
                                                        <p>No data.</p>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex-2 grid xl:grid-cols-12 gap-4">
                    <div className="xl:col-span-7 rounded-xl">
                        <ChartBarStacked data={yearly_data}/>
                    </div>
                    <Card className="xl:col-span-5 border px-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BetweenVerticalStart />Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent className="size-full flex flex-col px-0">
                            <DataTable table={table} data={recent_transactions} className="rounded-none border-none"/>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
