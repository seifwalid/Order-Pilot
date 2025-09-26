"use client"

import { useState } from "react"
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertCircle,
  Filter,
  Download,
  Bell,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RevenueChart } from "./components/revenue-chart"
import { DemandChart } from "./components/demand-chart"
import { TopProducts } from "./components/top-products"
import { AlertsPanel } from "./components/alerts-panel"

export default function DarkStoreDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹3,45,231</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">+12.5%</span> from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profit Margin
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.4%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">+2.1%</span> from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Orders Today
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">+8.2%</span> from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stock Alerts
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">15</div>
                <p className="text-xs text-muted-foreground">
                  Items below minimum stock
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Profit Trends</CardTitle>
                <CardDescription>Monthly performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Demand vs Supply</CardTitle>
                <CardDescription>Category-wise analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <DemandChart />
              </CardContent>
            </Card>
          </div>
          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TopProducts />
            </div>
            <div>
              <AlertsPanel />
            </div>
          </div>
          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Operational Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Order Fulfillment Rate</span>
                  <Badge variant="default">96.8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Delivery Time</span>
                  <Badge variant="secondary">12 min</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Satisfaction</span>
                  <Badge variant="default">4.7/5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Inventory Turnover</span>
                  <Badge variant="outline">8.2x</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Procurement Cost</span>
                  <span className="font-medium">₹2,45,680</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage Cost</span>
                  <span className="font-medium">₹18,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Operational Cost</span>
                  <span className="font-medium">₹32,100</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium">Total Cost</span>
                  <span className="font-bold">₹2,96,230</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Peak Hours</span>
                  <Badge variant="outline">6-8 PM</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Top Category</span>
                  <Badge variant="default">Groceries</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Growth Rate</span>
                  <Badge variant="default">+15.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Market Share</span>
                  <Badge variant="secondary">23.4%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
