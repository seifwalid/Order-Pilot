"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Play, StopCircle, Mic, MicOff, Volume2, VolumeX, Send, RotateCcw } from "lucide-react"

export default function PlaygroundPage({ params }: { params: { agentId: string } }) {
    const [isRecording, setIsRecording] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [message, setMessage] = useState("")
    const [conversation, setConversation] = useState([
        {
            id: 1,
            speaker: "user",
            message: "Hello Alex, I need help with my order.",
            timestamp: "10:30 AM"
        },
        {
            id: 2,
            speaker: "agent",
            message: "Hi! I'd be happy to help you with your order. Could you please provide me with your order number or the phone number you used to place the order?",
            timestamp: "10:30 AM"
        }
    ])
    
    const [testMetrics] = useState({
        responseTime: "1.2s",
        accuracy: "98%",
        sentiment: "Positive",
        wordsPerMinute: "145",
        callDuration: "2m 15s"
    })

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: conversation.length + 1,
                speaker: "user" as const,
                message: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setConversation([...conversation, newMessage])
            setMessage("")
            
            // Simulate agent response
            setTimeout(() => {
                const agentResponse = {
                    id: conversation.length + 2,
                    speaker: "agent" as const,
                    message: "I understand your concern. Let me check that information for you right away.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
                setConversation(prev => [...prev, agentResponse])
            }, 1500)
        }
    }

    const resetConversation = () => {
        setConversation([])
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-foreground text-4xl font-bold leading-tight">Agent Playground</h1>
                    <p className="text-muted-foreground text-lg font-normal leading-normal">
                        Test and experiment with agent {params.agentId} in a safe environment.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={resetConversation}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-2">
                    <Card className="bg-card/30 border-border h-[600px] flex flex-col">
                        <CardHeader className="border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                                        <AvatarImage src="/placeholder-user.jpg" alt="Agent Alex" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">A</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-foreground">Agent Alex</CardTitle>
                                        <p className="text-sm text-muted-foreground">Restaurant Voice Assistant</p>
                                    </div>
                                </div>
                                <Badge variant="default" className="bg-green-600 text-green-100">
                                    Active
                                </Badge>
                            </div>
                        </CardHeader>
                        
                        {/* Conversation Area */}
                        <CardContent className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {conversation.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.speaker === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.speaker === "agent" && (
                                            <Avatar className="h-8 w-8 border border-primary/20">
                                                <AvatarImage src="/placeholder-user.jpg" alt="Agent" />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">A</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${
                                                msg.speaker === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-foreground"
                                            }`}
                                        >
                                            <p className="text-sm">{msg.message}</p>
                                            <p className={`text-xs mt-1 ${
                                                msg.speaker === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                            }`}>
                                                {msg.timestamp}
                                            </p>
                                        </div>
                                        {msg.speaker === "user" && (
                                            <Avatar className="h-8 w-8 border border-primary/20">
                                                <AvatarFallback className="bg-muted text-foreground text-xs">U</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        
                        {/* Input Area */}
                        <div className="border-t border-border p-4">
                            <div className="flex gap-3">
                                <div className="flex gap-2">
                                    <Button
                                        variant={isRecording ? "destructive" : "outline"}
                                        size="icon"
                                        onClick={() => setIsRecording(!isRecording)}
                                    >
                                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setIsMuted(!isMuted)}
                                    >
                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message or use voice..."
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                    className="flex-1"
                                />
                                <Button onClick={handleSendMessage}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Controls & Metrics */}
                <div className="space-y-6">
                    {/* Voice Controls */}
                    <Card className="bg-card/30 border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground">Voice Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={isPlaying ? "destructive" : "default"}
                                    className="w-full"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                >
                                    {isPlaying ? (
                                        <>
                                            <StopCircle className="h-4 w-4 mr-2" />
                                            Stop
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-4 w-4 mr-2" />
                                            Play
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant={isRecording ? "destructive" : "outline"}
                                    className="w-full"
                                    onClick={() => setIsRecording(!isRecording)}
                                >
                                    {isRecording ? (
                                        <>
                                            <MicOff className="h-4 w-4 mr-2" />
                                            Stop Rec
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="h-4 w-4 mr-2" />
                                            Record
                                        </>
                                    )}
                                </Button>
                            </div>
                            {isRecording && (
                                <div className="text-center">
                                    <Badge variant="destructive" className="animate-pulse">
                                        Recording...
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Test Metrics */}
                    <Card className="bg-card/30 border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground">Test Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Response Time</span>
                                    <span className="text-sm font-semibold text-foreground glow-metric">{testMetrics.responseTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Accuracy</span>
                                    <span className="text-sm font-semibold text-foreground glow-percentage">{testMetrics.accuracy}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Sentiment</span>
                                    <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                                        {testMetrics.sentiment}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Words/Minute</span>
                                    <span className="text-sm font-semibold text-foreground glow-number">{testMetrics.wordsPerMinute}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Call Duration</span>
                                    <span className="text-sm font-semibold text-foreground glow-metric">{testMetrics.callDuration}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Tests */}
                    <Card className="bg-card/30 border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground">Quick Tests</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                Test Greeting
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                Test Order Taking
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                Test Complaint Handling
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                Test Menu Questions
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
