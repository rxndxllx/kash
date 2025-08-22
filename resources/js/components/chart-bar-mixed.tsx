"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A mixed bar chart"

const chartData = [
  { browser: "safari", visitors: 80000, fill: "var(--chart-2)" },
  { browser: "chrome", visitors: 70000, fill: "var(--chart-4)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Income",
    color: "var(--chart-2)",
  },
  chrome: {
    label: "Expense",
    color: "var(--chart-1)",
  },
  
} satisfies ChartConfig

export function ChartBarMixed() {
  return (
        <ChartContainer config={chartConfig} className="max-h-50">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }

            />
            <XAxis dataKey="visitors" type="number" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={false} />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
  )
}
