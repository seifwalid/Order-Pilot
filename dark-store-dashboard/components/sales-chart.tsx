"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  {
    day: "Mon",
    sales: 4200,
    orders: 89,
  },
  {
    day: "Tue",
    sales: 3800,
    orders: 76,
  },
  {
    day: "Wed",
    sales: 5100,
    orders: 102,
  },
  {
    day: "Thu",
    sales: 4600,
    orders: 94,
  },
  {
    day: "Fri",
    sales: 6200,
    orders: 128,
  },
  {
    day: "Sat",
    sales: 7800,
    orders: 156,
  },
  {
    day: "Sun",
    sales: 6900,
    orders: 142,
  },
]

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} />
        <YAxis yAxisId="sales" orientation="left" tick={{ fontSize: 12 }} tickLine={false} />
        <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 12 }} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Legend />
        <Bar yAxisId="sales" dataKey="sales" fill="hsl(var(--chart-1))" name="Sales ($)" radius={[2, 2, 0, 0]} />
        <Bar yAxisId="orders" dataKey="orders" fill="hsl(var(--chart-2))" name="Orders" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
