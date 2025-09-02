"use client"

import { ChartColumnStacked, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardStats } from "@/types/models"

export const description = "A stacked bar chart with a legend"

const chartConfig = {
  total_income: {
    label: "Income",
    color: "var(--chart-2)",
  },
  total_expense: {
    label: "Expense",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

/**
 * @todo
 * 1. Clean this component. This should be reusable.
 */
export function ChartBarStacked({ data }: { data: DashboardStats[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ChartColumnStacked />Monthly Overview</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
         <ChartContainer
            config={chartConfig}
            className="aspect-auto h-96 w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const months = [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                return months[value - 1];
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`} // optional, formats the number
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel/>} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="total_income"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total_expense"
              fill="var(--chart-4)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
