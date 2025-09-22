"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const callsData = [
  {
    id: "call-001",
    timestamp: "2024-03-15 10:00 AM",
    duration: "5m 30s",
    status: "completed",
    customerSatisfaction: 4.8,
    summary: "Product inquiry about new features",
  },
  {
    id: "call-002",
    timestamp: "2024-03-15 09:45 AM",
    duration: "3m 15s",
    status: "completed",
    customerSatisfaction: 4.5,
    summary: "Order status check",
  },
  {
    id: "call-003",
    timestamp: "2024-03-15 09:30 AM",
    duration: "7m 45s",
    status: "escalated",
    customerSatisfaction: 3.2,
    summary: "Technical support request",
  },
  {
    id: "call-004",
    timestamp: "2024-03-15 09:15 AM",
    duration: "2m 20s",
    status: "completed",
    customerSatisfaction: 5.0,
    summary: "Account information update",
  },
  {
    id: "call-005",
    timestamp: "2024-03-15 09:00 AM",
    duration: "4m 10s",
    status: "completed",
    customerSatisfaction: 4.7,
    summary: "Billing inquiry",
  },
]

export default function CallsListPage() {
  const params = useParams()
  const agentId = params.agentId as string

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary hover:bg-primary/80 text-primary-foreground"
      case "escalated":
        return "bg-accent hover:bg-accent/80 text-accent-foreground"
      case "failed":
        return "bg-destructive hover:bg-destructive/80 text-destructive-foreground"
      default:
        return "bg-muted hover:bg-muted/80 text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Interactions</h1>
        <p className="text-muted-foreground">Review all conversations and call history</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search interactions by ID, user, or keyword" className="pl-10" />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none bg-transparent">
            All Statuses
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none bg-transparent">
            Last 30 days
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {callsData.map((call) => (
          <Link key={call.id} href={`/dashboard/agents/${agentId}/calls/${call.id}`}>
            <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Call {call.id}</h3>
                      <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2 text-balance">{call.summary}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{call.timestamp}</span>
                      <span>Duration: {call.duration}</span>
                      <span>Rating: {call.customerSatisfaction}/5</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 self-center sm:self-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="default" size="icon">
          1
        </Button>
        <Button variant="ghost" size="icon">
          2
        </Button>
        <Button variant="ghost" size="icon">
          3
        </Button>
        <Button variant="ghost" size="icon">
          4
        </Button>
        <Button variant="ghost" size="icon">
          5
        </Button>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
