"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Minus, Navigation } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Alex's specific performance data
const alexResolutionRateData = [
    { day: "Mon", rate: 94 },
    { day: "Tue", rate: 96 },
    { day: "Wed", rate: 93 },
    { day: "Thu", rate: 97 },
    { day: "Fri", rate: 95 },
    { day: "Sat", rate: 98 },
    { day: "Sun", rate: 95 }
]

const alexSatisfactionData = [
    { rating: "1", count: 1 },
    { rating: "2", count: 0 },
    { rating: "3", count: 3 },
    { rating: "4", count: 12 },
    { rating: "5", count: 28 }
]

// Alex's specific data
const alexData = {
    name: "Alex",
    avatar: "/placeholder-user.jpg",
    resolutionRate: "95%",
    satisfaction: "4.8/5",
    handleTime: "5m 30s",
    totalCalls: "284",
    weeklyTrend: "+12%",
    satisfactionTrend: "+0.2",
    handleTimeTrend: "-15s"
}

export default function AgentOverviewPage({ params }: { params: { agentId: string } }) {
    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-foreground text-4xl font-bold leading-tight">Agent Alex Performance</h1>
                    <p className="text-muted-foreground text-lg font-normal leading-normal">
                        Real-time performance metrics and analytics for Alex's restaurant customer service.
                    </p>
                </div>
            </div>

            <div className="bg-cover bg-center min-h-[480px] flex flex-col justify-between p-6 rounded-xl"
                 style={{
                     backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjeMWtIQXRq456CEq3u6wNUS0y-5snVrmQtJ0frXGbwgsSgptLVdOYcKmTbw4bBrgfSXPqEFmYSws0RoM5NTSsu2vnqpkVobTHwQ2bvllLFpNmYKXSdT6bFLLpGdDD01MWej3Oa1JsxCggvYdx1S9JH3SbrUgl9EwMs1iQLlXQ44JZWetjl8EeAgvkOmHXrczISBXxB5X-TdRiWmRLEWy9xKY9GNGqkoOiIM5noxrPlePjx5C3S5MRHd3Cq1euV9-wTlBcydrFDKM')"
                 }}>
                <div className="w-full max-w-sm">
                    <div className="flex w-full items-stretch rounded-lg">
                        <div className="text-gray-400 flex bg-gray-900/50 backdrop-blur-sm items-center justify-center pl-4 rounded-l-lg">
                            <Search className="h-5 w-5" />
                        </div>
                        <input 
                            className="flex w-full min-w-0 flex-1 rounded-r-lg text-white bg-gray-900/50 backdrop-blur-sm h-12 placeholder:text-gray-400 px-4 text-base border-none outline-none"
                            placeholder="Search for agents"
                        />
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 self-end">
                    <div className="flex flex-col gap-0.5 bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-lg">
                        <button className="size-12 flex items-center justify-center rounded-t-lg hover:bg-gray-800/70 text-white">
                            <Plus className="h-5 w-5" />
                        </button>
                        <button className="size-12 flex items-center justify-center rounded-b-lg hover:bg-gray-800/70 text-white">
                            <Minus className="h-5 w-5" />
                        </button>
                    </div>
                    <button className="size-12 flex items-center justify-center rounded-lg bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 shadow-lg text-white">
                        <Navigation className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/30 border-border backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground text-base font-medium leading-normal">Resolution Rate</p>
                                    <p className="text-foreground text-3xl font-bold leading-tight glow-percentage">{alexData.resolutionRate}</p>
                                    <p className="text-green-400 text-sm font-medium leading-normal glow-percentage">{alexData.weeklyTrend}</p>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-card/30 border-border backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground text-base font-medium leading-normal">Customer Satisfaction</p>
                                    <p className="text-foreground text-3xl font-bold leading-tight glow-metric">{alexData.satisfaction}</p>
                                    <p className="text-green-400 text-sm font-medium leading-normal glow-percentage">+{alexData.satisfactionTrend}</p>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-card/30 border-border backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground text-base font-medium leading-normal">Average Handle Time</p>
                                    <p className="text-foreground text-3xl font-bold leading-tight glow-metric">{alexData.handleTime}</p>
                                    <p className="text-green-400 text-sm font-medium leading-normal glow-percentage">{alexData.handleTimeTrend}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alex Profile Section */}
            <Card className="bg-card/30 border-border backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-foreground text-lg font-bold leading-tight">Agent: {alexData.name}</h3>
                            <p className="text-muted-foreground text-base font-normal leading-normal">
                                Restaurant Voice Assistant • {alexData.totalCalls} total calls handled
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">Resolution: {alexData.resolutionRate}</span>
                                <span className="text-muted-foreground">Satisfaction: {alexData.satisfaction}</span>
                                <span className="text-muted-foreground">Avg Time: {alexData.handleTime}</span>
                            </div>
                        </div>
                        <Avatar className="w-20 h-20 border-2 border-primary/20">
                            <AvatarImage src={alexData.avatar} alt={alexData.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                                {alexData.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alex's Resolution Rate Chart */}
                <Card className="bg-card/30 border-border backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex flex-col">
                            <CardTitle className="text-muted-foreground text-base font-medium leading-normal">Alex's Resolution Rate Over Time</CardTitle>
                            <div className="flex items-baseline gap-2">
                                        <p className="text-foreground text-4xl font-bold leading-tight glow-percentage">{alexData.resolutionRate}</p>
                                        <p className="text-green-400 text-base font-medium leading-normal glow-percentage">{alexData.weeklyTrend}</p>
                            </div>
                            <p className="text-muted-foreground text-sm font-normal leading-normal">Last 7 Days</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={alexResolutionRateData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                    dataKey="day" 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        color: "hsl(var(--foreground))",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fill="hsl(var(--primary))"
                                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Alex's Customer Satisfaction Chart */}
                <Card className="bg-card/30 border-border backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex flex-col">
                            <CardTitle className="text-muted-foreground text-base font-medium leading-normal">Alex's Customer Satisfaction Ratings</CardTitle>
                            <div className="flex items-baseline gap-2">
                                        <p className="text-foreground text-4xl font-bold leading-tight glow-metric">{alexData.satisfaction}</p>
                                        <p className="text-green-400 text-base font-medium leading-normal glow-percentage">+{alexData.satisfactionTrend}</p>
                            </div>
                            <p className="text-muted-foreground text-sm font-normal leading-normal">Last 7 Days</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={alexSatisfactionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                    dataKey="rating" 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        color: "hsl(var(--foreground))",
                                    }}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="hsl(var(--primary))" 
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
