import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Phone, MessageSquare, Clock, User } from "lucide-react"
import Link from "next/link"

// Mock data for calls
const calls = [
    {
        id: "call-001",
        type: "Phone Call",
        customerName: "Maria Rodriguez",
        customerAvatar: "/placeholder-user.jpg",
        timestamp: "2 hours ago",
        duration: "4m 30s",
        status: "Resolved",
        topic: "Delivery Order Inquiry",
        sentiment: "Positive"
    },
    {
        id: "call-002", 
        type: "Chat",
        customerName: "James Chen",
        customerAvatar: "/placeholder-user.jpg",
        timestamp: "1 day ago",
        duration: "3m 15s",
        status: "Resolved",
        topic: "Menu Question",
        sentiment: "Positive"
    },
    {
        id: "call-003",
        type: "Phone Call",
        customerName: "Sarah Thompson",
        customerAvatar: "/placeholder-user.jpg",
        timestamp: "2 days ago", 
        duration: "7m 45s",
        status: "Escalated",
        topic: "Order Complaint",
        sentiment: "Negative"
    },
    {
        id: "call-004",
        type: "Chat",
        customerName: "David Kim",
        customerAvatar: "/placeholder-user.jpg",
        timestamp: "3 days ago",
        duration: "2m 50s", 
        status: "Resolved",
        topic: "Table Reservation",
        sentiment: "Positive"
    },
    {
        id: "call-005",
        type: "Phone Call",
        customerName: "Lisa Wang",
        customerAvatar: "/placeholder-user.jpg",
        timestamp: "1 week ago",
        duration: "5m 20s",
        status: "Resolved", 
        topic: "Catering Inquiry",
        sentiment: "Neutral"
    },
    {
        id: "call-006",
        type: "Chat",
        customerName: "Michael Brown",
        customerAvatar: "/placeholder-user.jpg",
        timestamp: "2 weeks ago",
        duration: "4m 10s",
        status: "Resolved", 
        topic: "Dietary Restrictions",
        sentiment: "Positive"
    }
]

export default function CallsPage({ params }: { params: { agentId: string } }) {
    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-foreground text-4xl font-bold leading-tight">Customer Calls</h1>
                    <p className="text-muted-foreground text-lg font-normal leading-normal">Review customer calls and support requests for agent {params.agentId}.</p>
                </div>
            </div>

            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    className="w-full pl-10"
                    placeholder="Search calls by customer name or topic"
                />
            </div>

            <div className="space-y-3">
                {calls.map((call) => (
                    <Link href={`/agents/${params.agentId}/calls/${call.id}`} key={call.id}>
                        <Card className="bg-card/80 border-border backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/20 hover:border-primary/80 cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-primary/10">
                                                {call.type === "Phone Call" ? 
                                                    <Phone className="h-5 w-5 text-primary" /> : 
                                                    <MessageSquare className="h-5 w-5 text-primary" />
                                                }
                                            </div>
                                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                                <AvatarImage src={call.customerAvatar} alt={call.customerName} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                    {call.customerName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">{call.customerName}</h3>
                                            <p className="text-sm text-muted-foreground">{call.topic}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-foreground glow-metric">{call.duration}</p>
                                                <p className="text-xs text-muted-foreground">Duration</p>
                                            </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-foreground">{call.timestamp}</p>
                                            <p className="text-xs text-muted-foreground">Time</p>
                                        </div>
                                        <div className="text-center">
                                            <Badge variant="outline" className="text-xs">
                                                {call.sentiment}
                                            </Badge>
                                        </div>
                                        <div className="text-center">
                                            <Badge variant={
                                                call.status === "Resolved" ? "default" :
                                                call.status === "In Progress" ? "secondary" :
                                                "destructive"
                                            } className="text-xs px-3 py-1">
                                                {call.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}