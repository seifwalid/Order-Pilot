"use client"

import { useState } from "react"
import {
  Home,
  ShoppingCart,
  ChefHat,
  Users,
  LineChart,
  Settings,
  DollarSign,
  Package,
  Eye,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

import { SalesChart } from "./sales-chart"
import { OrdersPage } from "./orders-page"
import { MenuPage } from "./menu-page"
import { StaffPage } from "./staff-page"
import { SettingsPage } from "./settings-page"
import { AgentsPerformancePage } from "./agents-performance-page"

const currentUser = {
  email: "owner@restaurant.com",
  role: "owner" as const,
}

const restaurantInfo = {
  name: "Bella Vista Restaurant",
  email: "contact@bellavista.com",
}

const menuItems = [
  { title: "Dashboard", icon: Home, isActive: true, roles: ["owner", "manager", "staff"] },
  { title: "Orders", icon: ShoppingCart, roles: ["owner", "manager", "staff"] },
  { title: "Menu", icon: ChefHat, roles: ["owner", "manager"] },
  { title: "Staff", icon: Users, roles: ["owner", "manager"] },
  { title: "Agents Performance", icon: LineChart, roles: ["owner"] },
  { title: "Settings", icon: Settings, roles: ["owner"] },
]

export default function OrderPilotDashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(currentUser.role))

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Orders":
        return <OrdersPage />
      case "Menu":
        return <MenuPage />
      case "Staff":
        return <StaffPage />
      case "Agents Performance":
        return <AgentsPerformancePage />
      case "Settings":
        return <SettingsPage />
      case "Dashboard":
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12.5%</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+8.2%</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">3,456</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+15.3%</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">8,924</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+5.7%</span> from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Sales Performance</CardTitle>
                <CardDescription>7-day sales and orders overview</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <SalesChart />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">$36.25</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-600">+4.2%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Customer Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">78.5%</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-600">+2.1%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Peak Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">6-8 PM</div>
                  <p className="text-sm text-muted-foreground mt-2">Highest order volume period</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-orange-800 dark:text-orange-200">
                    Welcome Back!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-700 dark:text-orange-300 break-all">
                    Logged in as: <span className="font-medium">{currentUser.email}</span>
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">Last login: Today at 9:30 AM</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/20 dark:to-blue-900/20 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-800 dark:text-blue-200">
                    Restaurant Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">{restaurantInfo.name}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 break-all">{restaurantInfo.email}</p>
                  <Badge
                    variant="outline"
                    className="mt-2 bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700"
                  >
                    Active
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800 sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-green-800 dark:text-green-200">Your Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Full access to all features</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="hidden lg:flex">
          <SidebarHeader className="border-b px-4 sm:px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold truncate">OrderPilot</h2>
                <p className="text-xs text-muted-foreground truncate">Restaurant Management</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.title === currentPage}
                        onClick={() => setCurrentPage(item.title)}
                      >
                        <button className="flex items-center space-x-2 w-full">
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 min-w-0">
          <header className="flex h-14 sm:h-16 items-center justify-between border-b px-4 sm:px-6">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <SidebarTrigger className="lg:hidden" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                  {currentPage === "Dashboard" ? "OrderPilot Dashboard" : `OrderPilot - ${currentPage}`}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {currentPage === "Dashboard"
                    ? "Restaurant management system"
                    : currentPage === "Agents Performance"
                      ? "Monitor AI agent performance and customer interactions"
                      : `Manage your ${currentPage.toLowerCase()}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700 text-xs sm:text-sm"
              >
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </Badge>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-auto">{renderCurrentPage()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
