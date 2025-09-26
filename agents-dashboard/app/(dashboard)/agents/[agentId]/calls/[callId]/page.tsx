import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Clock, User, Phone, MessageSquare, CheckCircle, Search, Filter, ChevronDown } from "lucide-react"
import Link from "next/link"

// Mock data for call details
const callDetails = {
    id: "call-001",
    customerName: "Maria Rodriguez",
    agentName: "Alex",
    agentAvatar: "/placeholder-user.jpg",
    timestamp: "2 hours ago",
    duration: "4m 30s",
    status: "Resolved",
    topic: "Delivery Order Inquiry",
    sentiment: "Positive",
    type: "Phone Call"
}

const interactions = [
    {
        id: 1,
        type: "inquiry",
        speaker: "customer",
        message: "Hi, I placed an order for delivery about 45 minutes ago. Can you check the status?",
        timestamp: "2 hours ago",
        icon: User,
        title: "Customer Inquiry",
        color: "bg-blue-500",
        textColor: "text-blue-100",
        shadowColor: "shadow-blue-500/20",
        category: "Question"
    },
    {
        id: 2,
        type: "response",
        speaker: "agent",
        message: "Of course! Let me check that for you. I see your order #R2847 for the chicken tikka masala and garlic naan. It's currently being prepared in the kitchen and should be ready for delivery in about 15 minutes.",
        timestamp: "2 hours ago",
        icon: MessageSquare,
        title: "Agent Response",
        color: "bg-emerald-500",
        textColor: "text-emerald-100",
        shadowColor: "shadow-emerald-500/20",
        category: "Response"
    },
    {
        id: 3,
        type: "follow-up",
        speaker: "customer", 
        message: "Perfect! Will the driver call when they arrive?",
        timestamp: "2 hours ago",
        icon: Phone,
        title: "Follow-up Question",
        color: "bg-amber-500",
        textColor: "text-amber-100",
        shadowColor: "shadow-amber-500/20",
        category: "Follow-up"
    },
    {
        id: 4,
        type: "resolution",
        speaker: "agent",
        message: "Yes, absolutely. Our driver will call you when they're at your building. Your estimated delivery time is 7:30 PM. Is there anything else I can help you with today?",
        timestamp: "2 hours ago",
        icon: MessageSquare,
        title: "Resolution Provided",
        color: "bg-emerald-500",
        textColor: "text-emerald-100",
        shadowColor: "shadow-emerald-500/20",
        category: "Resolution"
    },
    {
        id: 5,
        type: "completion",
        speaker: "customer", 
        message: "That's all, thank you so much!",
        timestamp: "2 hours ago",
        icon: CheckCircle,
        title: "Call Completed",
        color: "bg-green-600",
        textColor: "text-green-100",
        shadowColor: "shadow-green-600/20",
        category: "Completed"
    }
]

export default function CallDetailPage({ params }: { params: { callId: string; agentId: string } }) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b">
                <Link href={`/agents/${params.agentId}/calls`}>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-foreground text-2xl font-bold">Call Interaction</h1>
                        <Badge 
                            variant={
                                callDetails.status === "Resolved" ? "default" :
                                callDetails.status === "In Progress" ? "secondary" :
                                "destructive"
                            }
                            className={
                                callDetails.status === "Resolved" 
                                    ? "bg-green-600 text-green-100 hover:bg-green-700" 
                                    : callDetails.status === "In Progress"
                                    ? "bg-amber-500 text-amber-100 hover:bg-amber-600"
                                    : "bg-red-500 text-red-100 hover:bg-red-600"
                            }
                        >
                            {callDetails.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="glow-metric">{callDetails.duration}</span>
                        </span>
                        <span>{callDetails.type}</span>
                        <span>{callDetails.topic}</span>
                        <span>Customer: {callDetails.customerName}</span>
                        <Badge 
                            variant="outline" 
                            className={`text-xs ${
                                callDetails.sentiment === "Positive" 
                                    ? "border-green-500/50 text-green-400 bg-green-500/10" 
                                    : callDetails.sentiment === "Negative"
                                    ? "border-red-500/50 text-red-400 bg-red-500/10"
                                    : "border-amber-500/50 text-amber-400 bg-amber-500/10"
                            }`}
                        >
                            {callDetails.sentiment} sentiment
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Interaction Timeline */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-foreground text-2xl font-bold">Interaction Flow</h2>
                        <p className="text-muted-foreground">Review and analyze the complete interaction with your customer.</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            className="w-full pl-10"
                            placeholder="Search interactions by keyword"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            All Types
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="gap-2">
                            Show Details
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Timeline Grid */}
                    <div className="grid grid-cols-[40px_1fr] gap-x-4">
                        {interactions.map((interaction, index) => (
                            <div key={interaction.id} className="contents">
                                {/* Timeline Icon */}
                                <div className="flex flex-col items-center gap-y-2">
                                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${interaction.color} ${interaction.textColor} shadow-lg ${interaction.shadowColor}`}>
                                        <interaction.icon className="h-5 w-5" />
                                    </div>
                                    {/* Timeline Line */}
                                    {index < interactions.length - 1 && (
                                        <div className="w-0.5 h-16 bg-gradient-to-b from-border to-transparent"></div>
                                    )}
                                </div>
                                
                                {/* Interaction Card */}
                                <div className="flex-1 rounded-lg border border-border bg-card/80 backdrop-blur-sm p-4 mb-8 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-foreground font-medium">{interaction.title}</h3>
                                            <Badge 
                                                variant="secondary" 
                                                className={`text-xs px-2 py-1 ${interaction.color} ${interaction.textColor} border-0`}
                                            >
                                                {interaction.category}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {interaction.speaker === "agent" ? "Agent" : "Customer"}
                                            </Badge>
                                            <p className="text-muted-foreground text-sm">{interaction.timestamp}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-foreground/90 leading-relaxed mb-3">{interaction.message}</p>
                                    
                                    {/* Speaker Info */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage 
                                                src={interaction.speaker === "agent" ? callDetails.agentAvatar : "/placeholder-user.jpg"} 
                                                alt={interaction.speaker === "agent" ? callDetails.agentName : callDetails.customerName} 
                                            />
                                            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                                {interaction.speaker === "agent" ? 
                                                    callDetails.agentName.charAt(0) : 
                                                    callDetails.customerName.charAt(0)
                                                }
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">
                                            {interaction.speaker === "agent" ? 
                                                `Agent ${callDetails.agentName}` : 
                                                callDetails.customerName
                                            }
                                        </span>
                                        
                                        {/* Duration indicator for longer interactions */}
                                        {interaction.speaker === "agent" && interaction.type === "response" && (
                                            <Badge variant="outline" className="text-xs ml-auto bg-muted/50">
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span className="glow-metric">45s</span>
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
