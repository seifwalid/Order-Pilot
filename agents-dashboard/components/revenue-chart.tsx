"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", revenue: 45000, profit: 12000 },
  { month: "Feb", revenue: 52000, profit: 15600 },
  { month: "Mar", revenue: 48000, profit: 13440 },
  { month: "Apr", revenue: 61000, profit: 18300 },
  { month: "May", revenue: 55000, profit: 16500 },
  { month: "Jun", revenue: 67000, profit: 20100 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [`₹${value.toLocaleString()}`, name === "revenue" ? "Revenue" : "Profit"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#revenue)" />
        <Area type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#profit)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
