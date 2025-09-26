"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, EyeOff, RefreshCw, Key, Code, Zap, BarChart3 } from "lucide-react"

export default function ApiPage({ params }: { params: { agentId: string } }) {
    const [showApiKey, setShowApiKey] = useState(false)
    const [selectedEndpoint, setSelectedEndpoint] = useState("chat")
    
    const apiKey = "sk-ag_alex_live_1234567890abcdef"
    const baseUrl = "https://api.aura.restaurant/v1"
    
    const endpoints = [
        {
            id: "chat",
            name: "Chat Completion",
            method: "POST",
            path: "/agents/{agentId}/chat",
            description: "Send a message to the agent and get a response",
        },
        {
            id: "voice",
            name: "Voice Call",
            method: "POST", 
            path: "/agents/{agentId}/voice",
            description: "Start a voice conversation with the agent",
        },
        {
            id: "config",
            name: "Configuration",
            method: "GET",
            path: "/agents/{agentId}/config",
            description: "Get current agent configuration",
        },
        {
            id: "metrics",
            name: "Metrics",
            method: "GET",
            path: "/agents/{agentId}/metrics",
            description: "Get agent performance metrics",
        }
    ]
    
    const [usageStats] = useState({
        totalRequests: "2,847",
        monthlyQuota: "10,000",
        avgResponseTime: "1.2s",
        successRate: "99.8%",
        uptime: "99.99%"
    })

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const codeExamples = {
        chat: `curl -X POST "${baseUrl}/agents/${params.agentId}/chat" \\
  -H "Authorization: Bearer ${showApiKey ? apiKey : 'sk-ag_****'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Hello, I need help with my order",
    "context": {
      "customer_id": "cust_123",
      "session_id": "sess_456"
    }
  }'`,
        voice: `curl -X POST "${baseUrl}/agents/${params.agentId}/voice" \\
  -H "Authorization: Bearer ${showApiKey ? apiKey : 'sk-ag_****'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+1234567890",
    "greeting": "custom",
    "recording": true
  }'`,
        config: `curl -X GET "${baseUrl}/agents/${params.agentId}/config" \\
  -H "Authorization: Bearer ${showApiKey ? apiKey : 'sk-ag_****'}"`,
        metrics: `curl -X GET "${baseUrl}/agents/${params.agentId}/metrics?period=7d" \\
  -H "Authorization: Bearer ${showApiKey ? apiKey : 'sk-ag_****'}"`
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-foreground text-4xl font-bold leading-tight">API Documentation</h1>
                    <p className="text-muted-foreground text-lg font-normal leading-normal">
                        Integrate agent {params.agentId} into your applications using our REST API.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate Key
                    </Button>
                </div>
            </div>

            {/* API Key Section */}
            <Card className="bg-card/30 border-border">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Authentication
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Input
                            type={showApiKey ? "text" : "password"}
                            value={apiKey}
                            readOnly
                            className="flex-1 font-mono"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowApiKey(!showApiKey)}
                        >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(apiKey)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Include this API key in the Authorization header as a Bearer token for all requests.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* API Usage Stats */}
                <div className="space-y-6">
                    <Card className="bg-card/30 border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Usage Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Requests</span>
                                    <span className="text-sm font-semibold text-foreground glow-number">{usageStats.totalRequests}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Monthly Quota</span>
                                    <span className="text-sm font-semibold text-foreground glow-number">{usageStats.monthlyQuota}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                                    <span className="text-sm font-semibold text-foreground glow-metric">{usageStats.avgResponseTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Success Rate</span>
                                    <span className="text-sm font-semibold text-foreground glow-percentage">{usageStats.successRate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Uptime</span>
                                    <span className="text-sm font-semibold text-foreground glow-percentage">{usageStats.uptime}</span>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-border">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Current Usage</span>
                                    <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                                        <span className="glow-percentage">28% of quota</span>
                                    </Badge>
                                </div>
                                <div className="mt-2 w-full bg-muted/30 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: '28%' }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rate Limits */}
                    <Card className="bg-card/30 border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground">Rate Limits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Requests/minute</span>
                                <span className="text-sm font-semibold text-foreground glow-number">100</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Requests/hour</span>
                                <span className="text-sm font-semibold text-foreground glow-number">5,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Concurrent calls</span>
                                <span className="text-sm font-semibold text-foreground glow-number">10</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* API Endpoints */}
                <div className="lg:col-span-2">
                    <Card className="bg-card/30 border-border">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                API Endpoints
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                                <TabsList className="grid w-full grid-cols-4">
                                    {endpoints.map((endpoint) => (
                                        <TabsTrigger key={endpoint.id} value={endpoint.id} className="text-xs">
                                            {endpoint.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                
                                {endpoints.map((endpoint) => (
                                    <TabsContent key={endpoint.id} value={endpoint.id} className="mt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="font-mono">
                                                    {endpoint.method}
                                                </Badge>
                                                <code className="text-sm bg-muted px-2 py-1 rounded">
                                                    {endpoint.path}
                                                </code>
                                            </div>
                                            
                                            <p className="text-sm text-muted-foreground">
                                                {endpoint.description}
                                            </p>
                                            
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-sm font-semibold text-foreground">Example Request</h4>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(codeExamples[endpoint.id as keyof typeof codeExamples])}
                                                    >
                                                        <Copy className="h-3 w-3 mr-1" />
                                                        Copy
                                                    </Button>
                                                </div>
                                                <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
                                                    <code>{codeExamples[endpoint.id as keyof typeof codeExamples]}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Base URL & Info */}
            <Card className="bg-card/30 border-border">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">Base Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Base URL</label>
                        <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 text-sm bg-muted px-3 py-2 rounded">{baseUrl}</code>
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(baseUrl)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Agent ID</label>
                        <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 text-sm bg-muted px-3 py-2 rounded">{params.agentId}</code>
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(params.agentId)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
