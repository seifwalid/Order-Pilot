"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useParams } from "next/navigation"

const performanceData = [
  { time: "00:00", calls: 12, sentiment: 85 },
  { time: "04:00", calls: 8, sentiment: 90 },
  { time: "08:00", calls: 25, sentiment: 82 },
  { time: "12:00", calls: 35, sentiment: 88 },
  { time: "16:00", calls: 28, sentiment: 91 },
  { time: "20:00", calls: 15, sentiment: 87 },
]

export default function AgentOverviewPage() {
  const params = useParams()
  const agentId = params.agentId as string

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Agent Overview</h1>
        <p className="text-muted-foreground">Performance metrics and activity for Agent {agentId}</p>
      </div>

      {/* Agent Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-muted flex-shrink-0">
              <img src="/agent-avatar-detailed.png" alt="Agent Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold">Agent {agentId}</h2>
              <p className="text-muted-foreground">AI Voice Assistant</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="default" className="bg-primary hover:bg-primary/90">
                  Active
                </Badge>
                <Badge variant="outline">Voice Enabled</Badge>
                <Badge variant="outline">Multi-language</Badge>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-bold text-primary">98.5%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-sm text-primary">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-sm text-primary">-0.3s improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-sm text-primary">+2.1% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customer Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-sm text-muted-foreground">Based on 89 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Call volume and sentiment analysis over the last 24 hours</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-muted-foreground" />
              <YAxis yAxisId="left" className="text-muted-foreground" />
              <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="calls"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Calls"
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sentiment"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Sentiment %"
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-balance">Handled customer inquiry about product features</p>
                <p className="text-sm text-muted-foreground">2 minutes ago</p>
              </div>
              <Badge variant="default" className="bg-primary hover:bg-primary/90 ml-3">
                Resolved
              </Badge>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-balance">Escalated technical support request</p>
                <p className="text-sm text-muted-foreground">15 minutes ago</p>
              </div>
              <Badge variant="outline" className="ml-3">
                Escalated
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-balance">Completed order status check</p>
                <p className="text-sm text-muted-foreground">32 minutes ago</p>
              </div>
              <Badge variant="default" className="bg-primary hover:bg-primary/90 ml-3">
                Resolved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
