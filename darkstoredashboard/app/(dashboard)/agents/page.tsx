import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import Link from "next/link"

// Mock API function to fetch agents
const getRestaurantAgents = () => {
    // Simulate API response with all agents
    const allAgents = [
        { id: "alex", name: "Alex", avatar: "/placeholder-user.jpg", resolutionRate: "95%", satisfaction: "4.8/5", handleTime: "5m 30s", status: "Active", totalCalls: 284, department: "Customer Service" },
        { id: "sara", name: "Sara", avatar: "/placeholder-user.jpg", resolutionRate: "92%", satisfaction: "4.7/5", handleTime: "6m 15s", status: "Active", totalCalls: 156, department: "Technical Support" },
        { id: "john", name: "John", avatar: "/placeholder-user.jpg", resolutionRate: "88%", satisfaction: "4.5/5", handleTime: "7m 00s", status: "Inactive", totalCalls: 89, department: "Sales" },
    ];
    
    // Filter to only active restaurant voice agents (currently only Alex for restaurant operations)
    return allAgents.filter(agent => agent.department === "Customer Service" && agent.status === "Active");
};

// Get only restaurant voice agents
const agents = getRestaurantAgents();


export default function AgentsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="space-y-8">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-foreground text-4xl font-bold leading-tight">Restaurant Voice Agents</h1>
                        <p className="text-muted-foreground text-lg font-normal leading-normal">Active voice assistants for restaurant customer service operations.</p>
                    </div>
                </div>

                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="w-full pl-10"
                        placeholder="Search voice agents by name"
                    />
                </div>

            <div className="space-y-4">
                {agents.map((agent) => (
                    <Link href={`/agents/${agent.id}`} key={agent.id}>
                        <Card className="bg-card/80 border-border backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/20 hover:border-primary/80 cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src={agent.avatar} alt={agent.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {agent.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">Agent {agent.name}</h3>
                                            <p className="text-sm text-muted-foreground">Restaurant Voice Assistant • {agent.totalCalls} total calls</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{agent.resolutionRate}</p>
                                            <p className="text-xs text-muted-foreground">Resolution Rate</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{agent.satisfaction}</p>
                                            <p className="text-xs text-muted-foreground">Satisfaction</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{agent.handleTime}</p>
                                            <p className="text-xs text-muted-foreground">Avg. Handle Time</p>
                                        </div>
                                        <div className="text-center">
                                            <Badge variant={
                                                agent.status === "Active" ? "default" :
                                                agent.status === "Inactive" ? "destructive" :
                                                "secondary"
                                            } className="text-xs px-3 py-1">
                                                {agent.status}
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
        </div>
    )
}
