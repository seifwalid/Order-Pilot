"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Bot,
  MessageSquare,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  DollarSign,
  MoreVertical,
  Settings,
  Play,
  Pause,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AgentsPerformancePage() {
  const agentMetrics = [
    {
      id: 1,
      name: "Order Assistant",
      type: "Voice AI",
      status: "active",
      callsHandled: 342,
      avgResponseTime: "2.3s",
      successRate: 94,
      revenue: 12450,
    },
    {
      id: 2,
      name: "Support Bot",
      type: "Chat AI",
      status: "active",
      callsHandled: 156,
      avgResponseTime: "1.8s",
      successRate: 89,
      revenue: 3200,
    },
    {
      id: 3,
      name: "Reservation Agent",
      type: "Voice AI",
      status: "maintenance",
      callsHandled: 89,
      avgResponseTime: "3.1s",
      successRate: 91,
      revenue: 5600,
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Interactions</CardTitle>
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">587</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">2.1s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-0.3s</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">91.3%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">AI Revenue</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">$21,250</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">Agent Performance Overview</CardTitle>
          <CardDescription className="text-sm">Monitor individual AI agent metrics and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {agentMetrics.map((agent) => (
              <div
                key={agent.id}
                className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-950/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm sm:text-base truncate">{agent.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{agent.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={agent.status === "active" ? "default" : "secondary"}
                      className={
                        agent.status === "active"
                          ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700 text-xs"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700 text-xs"
                      }
                    >
                      {agent.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {agent.status === "active" ? (
                            <Pause className="mr-2 h-4 w-4" />
                          ) : (
                            <Play className="mr-2 h-4 w-4" />
                          )}
                          {agent.status === "active" ? "Pause Agent" : "Start Agent"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Conversations
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Performance Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-medium">{agent.callsHandled}</p>
                    <p className="text-xs text-muted-foreground">Interactions</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm sm:text-base font-medium">{agent.avgResponseTime}</p>
                    <p className="text-xs text-muted-foreground">Response</p>
                  </div>

                  <div className="text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm sm:text-base font-medium">{agent.successRate}%</p>
                      <Progress value={agent.successRate} className="w-12 h-2 mt-1" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Success</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm sm:text-base font-medium">${agent.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span>Top Performing Agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium text-sm sm:text-base">Order Assistant</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Handled 342 interactions with 94% success rate</p>
              <p className="text-xs sm:text-sm text-green-600 font-medium">Generated $12,450 in revenue</p>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-xs sm:text-sm">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span>Attention Needed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium text-sm sm:text-base">Reservation Agent</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Currently in maintenance mode</p>
              <p className="text-xs sm:text-sm text-orange-600 font-medium">Expected back online in 2 hours</p>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-xs sm:text-sm">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Check Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
          <CardDescription className="text-sm">Live feed of AI agent interactions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium">Order Assistant completed order #ORD-1247</p>
                <p className="text-xs text-muted-foreground">2 minutes ago • $28.50 revenue</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium">Support Bot resolved customer inquiry</p>
                <p className="text-xs text-muted-foreground">5 minutes ago • 98% satisfaction score</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium">Reservation Agent entered maintenance mode</p>
                <p className="text-xs text-muted-foreground">1 hour ago • Scheduled maintenance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
