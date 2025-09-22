"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, HelpCircle, Mic, MessageCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const interactionSteps = [
  {
    id: 1,
    type: "user_inquiry",
    icon: HelpCircle,
    title: "User Inquiry",
    timestamp: "2024-03-15 10:00 AM",
    content: "What's the status of my recent order?",
    speaker: "Customer",
  },
  {
    id: 2,
    type: "agent_response",
    icon: Mic,
    title: "Agent Response",
    timestamp: "2024-03-15 10:05 AM",
    content: "Your order #12345 has been shipped and is expected to arrive on March 18th.",
    speaker: "Agent",
  },
  {
    id: 3,
    type: "user_feedback",
    icon: MessageCircle,
    title: "User Feedback",
    timestamp: "2024-03-15 10:10 AM",
    content: "Great, thank you!",
    speaker: "Customer",
  },
  {
    id: 4,
    type: "interaction_success",
    icon: CheckCircle,
    title: "Interaction Succeeded",
    timestamp: "2024-03-15 10:20 AM",
    content: "The user's query was resolved successfully.",
    speaker: "System",
  },
]

export default function InteractionLogPage() {
  const params = useParams()
  const { agentId, callId } = params

  const getStepColor = (type: string) => {
    switch (type) {
      case "user_inquiry":
        return "bg-accent"
      case "agent_response":
        return "bg-primary"
      case "user_feedback":
        return "bg-primary/80"
      case "interaction_success":
        return "bg-primary"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-card p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Agent {agentId}</h1>
        </div>

        <nav className="space-y-2">
          <Link
            href={`/dashboard/agents/${agentId}`}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <div className="h-6 w-6" />
            <span className="text-sm font-medium">Overview</span>
          </Link>
          <div className="flex items-center gap-3 rounded-md bg-primary px-3 py-2 text-primary-foreground">
            <div className="h-6 w-6" />
            <span className="text-sm font-medium">Interactions</span>
          </div>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <div className="h-6 w-6" />
            <span className="text-sm font-medium">Playground</span>
          </Link>
          <Link
            href={`/dashboard/agents/${agentId}/config`}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <div className="h-6 w-6" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <div className="h-6 w-6" />
            <span className="text-sm font-medium">API</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Interactions</h1>
            <p className="text-muted-foreground">Review and analyze interactions with your agent.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search interactions by ID, user, or keyword" className="pl-10" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                All Statuses
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                Last 30 days
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Interaction Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {interactionSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="relative flex gap-4">
                    {/* Timeline Node */}
                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${getStepColor(step.type)} text-white shadow-lg`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content Card */}
                    <Card className="flex-1 cursor-pointer transition-all hover:border-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{step.title}</h3>
                          <span className="text-sm text-muted-foreground">{step.timestamp}</span>
                        </div>
                        <p className="mt-2 text-muted-foreground">{step.content}</p>
                        {step.speaker !== "System" && (
                          <Badge variant="outline" className="mt-2">
                            {step.speaker}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <Link href={`/dashboard/agents/${agentId}/calls`}>
              <Button variant="outline">Back to Calls</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
