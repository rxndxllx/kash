"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TransactionType } from "@/lib/enums"

export const description = "A mixed bar chart"

const chartConfig = {
  total: {
    label: "Amount",
  },
  income: {
    label: "Income",
    color: "var(--chart-2)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-4)",
  },
  
} satisfies ChartConfig

/**
 * @todo
 * 1. Clean this component. This should be reusable.
 */
export function ChartBarMixed({ data }: { data: { type: TransactionType.EXPENSE|TransactionType.INCOME; total: number; fill: string; }[]}) {
  return (
        <ChartContainer config={chartConfig} className="max-h-50">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
          >
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }

            />
            <XAxis dataKey="total" type="number" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={false} />}
            />
            <Bar dataKey="total" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
  )
}
