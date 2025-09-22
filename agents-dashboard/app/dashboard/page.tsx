"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const callVolumeData = [
  { day: "Mon", calls: 120 },
  { day: "Tue", calls: 150 },
  { day: "Wed", calls: 180 },
  { day: "Thu", calls: 200 },
  { day: "Fri", calls: 170 },
  { day: "Sat", calls: 140 },
  { day: "Sun", calls: 160 },
]

const sentimentData = [
  { name: "Positive", value: 60, color: "hsl(var(--chart-2))" },
  { name: "Neutral", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Negative", value: 25, color: "hsl(var(--chart-1))" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-3xl" />
        <div className="relative max-w-4xl">
          <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
            <img
              src="/data-dashboard-overview.png"
              alt="Dashboard Visualization"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Agentic Voice Dashboard</h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Real-time monitoring and interactive visualizations for your voice agent.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Call Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-sm text-primary">+12%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
            <p className="text-sm text-destructive">-5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-sm text-primary">+3%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-medium text-muted-foreground">Call Volume Over Time</CardTitle>
                <div className="text-4xl font-bold">1,234</div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last 7 Days</p>
                <p className="text-sm text-primary">+12%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="hsl(var(--primary))"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-medium text-muted-foreground">Sentiment Distribution</CardTitle>
                <div className="text-4xl font-bold">85%</div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last 7 Days</p>
                <p className="text-sm text-destructive">-5%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: item.color }}>{item.name}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
