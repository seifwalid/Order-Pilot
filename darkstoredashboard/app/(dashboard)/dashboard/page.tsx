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
  { name: "Positive", value: 60, color: "text-green-400", bgColor: "bg-green-400", shadowColor: "shadow-green-400/50" },
  { name: "Neutral", value: 15, color: "text-yellow-400", bgColor: "bg-yellow-400", shadowColor: "shadow-yellow-400/50" },
  { name: "Negative", value: 25, color: "text-red-400", bgColor: "bg-red-400", shadowColor: "shadow-red-400/50" },
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 mb-16">
        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent blur-3xl" />
          <div className="relative max-w-4xl w-full">
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm holographic-glow">
              <img
                src="/futuristic-dashboard-visualization-with-charts-and.jpg"
                alt="Dashboard Visualization"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl neon-text">Agentic Voice Dashboard</h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Real-time monitoring and interactive visualizations for your voice agent.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card/80 border-primary/20 backdrop-blur-sm neon-border transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Call Volume</CardTitle>
            </CardHeader>
            <CardContent>
                      <div className="text-3xl font-bold glow-number">1,234</div>
                      <p className="text-sm font-medium text-green-400 glow-percentage">
                        +12%
                      </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-primary/20 backdrop-blur-sm neon-border transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment Score</CardTitle>
            </CardHeader>
            <CardContent>
                      <div className="text-3xl font-bold glow-percentage">85%</div>
                      <p className="text-sm font-medium text-red-400 glow-percentage">
                        -5%
                      </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-primary/20 backdrop-blur-sm neon-border transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
                      <div className="text-3xl font-bold glow-percentage">92%</div>
                      <p className="text-sm font-medium text-green-400 glow-percentage">
                        +3%
                      </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3 bg-card/80 border-primary/20 backdrop-blur-sm neon-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium text-muted-foreground">Call Volume Over Time</CardTitle>
                          <div className="text-4xl font-bold glow-number">1,234</div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last 7 Days</p>
                  <p className="text-sm font-medium text-green-400 glow-percentage">
                    +12%
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--primary), 0.1)" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsla(var(--primary), 0.2)",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                      boxShadow: "0 0 10px hsla(var(--primary), 0.3)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="hsl(var(--primary))"
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-card/80 border-primary/20 backdrop-blur-sm neon-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium text-muted-foreground">Sentiment Distribution</CardTitle>
                          <div className="text-4xl font-bold glow-percentage">85%</div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last 7 Days</p>
                  <p className="text-sm font-medium text-red-400 glow-percentage">
                    -5%
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentimentData.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={`${item.color} font-medium`}>{item.name}</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted/30">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${item.bgColor} ${item.shadowColor}`}
                        style={{
                          width: `${item.value}%`,
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
    </div>
  )
}
