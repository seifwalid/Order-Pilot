"use client"

import { useState } from "react"
import { Clock, Phone, User, ChevronRight, CheckCircle, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    phone: "+1 (555) 123-4567",
    items: [
      { name: "Margherita Pizza", quantity: 2, options: "Extra cheese" },
      { name: "Caesar Salad", quantity: 1, options: "" },
    ],
    total: 28.5,
    timestamp: "2:30 PM",
    status: "pending" as const,
    instructions: "Please make pizza extra crispy",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    items: [
      { name: "Chicken Alfredo", quantity: 1, options: "No mushrooms" },
      { name: "Garlic Bread", quantity: 2, options: "" },
    ],
    total: 22.75,
    timestamp: "2:25 PM",
    status: "preparing" as const,
    instructions: "",
  },
  {
    id: "ORD-003",
    customer: "Mike Davis",
    phone: "+1 (555) 456-7890",
    items: [
      { name: "BBQ Burger", quantity: 1, options: "Medium rare" },
      { name: "French Fries", quantity: 1, options: "Extra crispy" },
    ],
    total: 18.25,
    timestamp: "2:20 PM",
    status: "ready" as const,
    instructions: "Customer will pick up in 10 minutes",
  },
]

const completedOrders = [
  {
    id: "ORD-004",
    customer: "Emma Wilson",
    total: 35.5,
    timestamp: "2:15 PM",
    completedAt: "2:45 PM",
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    total: 24.75,
    timestamp: "2:10 PM",
    completedAt: "2:40 PM",
  },
]

export function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)

  const moveOrder = (orderId: string, newStatus: "pending" | "preparing" | "ready" | "completed") => {
    setOrders((prevOrders) =>
      prevOrders
        .map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
        .filter((order) => order.status !== "completed"),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "preparing"
      case "preparing":
        return "ready"
      case "ready":
        return "completed"
      default:
        return currentStatus
    }
  }

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "Start Preparing"
      case "preparing":
        return "Mark Ready"
      case "ready":
        return "Complete Order"
      default:
        return ""
    }
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const preparingOrders = orders.filter((order) => order.status === "preparing")
  const readyOrders = orders.filter((order) => order.status === "ready")

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Pending Column */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold">Pending</h2>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700"
            >
              {pendingOrders.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-yellow-400">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{order.id}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:hidden">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{order.customer}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between items-start">
                          <span className="flex-1 min-w-0">
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                          </span>
                        </div>
                        {item.options && (
                          <div className="text-xs text-muted-foreground ml-4 mt-1 break-words">{item.options}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {order.instructions && (
                    <div className="text-xs bg-orange-50 dark:bg-orange-950/20 p-2 rounded border border-orange-200 dark:border-orange-800">
                      <strong>Instructions:</strong> <span className="break-words">{order.instructions}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{order.timestamp}</span>
                    </div>
                    <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full h-9 sm:h-8"
                    onClick={() => moveOrder(order.id, getNextStatus(order.status) as any)}
                  >
                    <span className="truncate">{getNextStatusLabel(order.status)}</span>
                    <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold">Preparing</h2>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700"
            >
              {preparingOrders.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {preparingOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-blue-400">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{order.id}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:hidden">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{order.customer}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between items-start">
                          <span className="flex-1 min-w-0">
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                          </span>
                        </div>
                        {item.options && (
                          <div className="text-xs text-muted-foreground ml-4 mt-1 break-words">{item.options}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {order.instructions && (
                    <div className="text-xs bg-orange-50 dark:bg-orange-950/20 p-2 rounded border border-orange-200 dark:border-orange-800">
                      <strong>Instructions:</strong> <span className="break-words">{order.instructions}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{order.timestamp}</span>
                    </div>
                    <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full h-9 sm:h-8"
                    onClick={() => moveOrder(order.id, getNextStatus(order.status) as any)}
                  >
                    <span className="truncate">{getNextStatusLabel(order.status)}</span>
                    <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ready Column */}
        <div className="space-y-3 sm:space-y-4 md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold">Ready</h2>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700"
            >
              {readyOrders.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {readyOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-green-400">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{order.id}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:hidden">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{order.customer}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between items-start">
                          <span className="flex-1 min-w-0">
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                          </span>
                        </div>
                        {item.options && (
                          <div className="text-xs text-muted-foreground ml-4 mt-1 break-words">{item.options}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {order.instructions && (
                    <div className="text-xs bg-orange-50 dark:bg-orange-950/20 p-2 rounded border border-orange-200 dark:border-orange-800">
                      <strong>Instructions:</strong> <span className="break-words">{order.instructions}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{order.timestamp}</span>
                    </div>
                    <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full h-9 sm:h-8 bg-green-600 hover:bg-green-700"
                    onClick={() => moveOrder(order.id, getNextStatus(order.status) as any)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{getNextStatusLabel(order.status)}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">Recently Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2 sm:space-y-0"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base">{order.id}</div>
                    <div className="text-sm text-muted-foreground truncate">{order.customer}</div>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="font-medium text-sm sm:text-base">${order.total.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Completed at {order.completedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
