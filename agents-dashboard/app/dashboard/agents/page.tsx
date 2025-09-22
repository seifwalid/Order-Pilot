"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Minus, Navigation } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts"
import Link from "next/link"

const resolutionData = [
  { day: "Mon", rate: 92 },
  { day: "Tue", rate: 88 },
  { day: "Wed", rate: 95 },
  { day: "Thu", rate: 91 },
  { day: "Fri", rate: 97 },
  { day: "Sat", rate: 89 },
  { day: "Sun", rate: 93 },
]

const satisfactionData = [
  { rating: "1", count: 10 },
  { rating: "2", count: 5 },
  { rating: "3", count: 20 },
  { rating: "4", count: 40 },
  { rating: "5", count: 85 },
]

export default function AgentPerformancePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Agent Performance Overview</h1>
          <p className="text-lg text-muted-foreground">
            Visualize and interact with real-time agent metrics in a dynamic 3D environment.
          </p>
        </div>
      </div>

      {/* 3D Environment Section */}
      <div className="relative min-h-[480px] overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/3d-agent-environment.png')",
          }}
        />
        <div className="absolute inset-0 bg-background/20" />

        {/* Search Bar */}
        <div className="absolute left-6 top-6 w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search for agents" className="bg-background/50 pl-10 backdrop-blur-sm" />
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3">
          <div className="flex flex-col rounded-lg bg-background/50 backdrop-blur-sm">
            <Button variant="ghost" size="icon" className="rounded-b-none">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-t-none">
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="bg-background/50 backdrop-blur-sm">
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">Average Handle Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5m 30s</div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link href="/dashboard/agents/alex-org123" className="group">
                <h3 className="text-lg font-bold group-hover:text-primary">Agent: Alex</h3>
                <p className="text-muted-foreground">Resolution Rate: 95%, Satisfaction: 4.8/5</p>
              </Link>
            </div>
            <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-muted">
              <img src="/agent-avatar-alex.png" alt="Agent Alex" className="h-full w-full object-cover" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex flex-col">
              <CardTitle className="text-base font-medium text-muted-foreground">Resolution Rate Over Time</CardTitle>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold">95%</div>
                <div className="text-base font-medium text-primary">+2%</div>
              </div>
              <p className="text-sm text-muted-foreground">Last 7 Days</p>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="hsl(var(--primary))"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Customer Satisfaction Ratings
              </CardTitle>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold">4.8/5</div>
                <div className="text-base font-medium text-primary">+0.1</div>
              </div>
              <p className="text-sm text-muted-foreground">Last 7 Days</p>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
