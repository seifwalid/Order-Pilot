"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mic, Send } from "lucide-react"

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Playground</h1>
        <p className="text-muted-foreground">Test and experiment with your agent in real-time</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Test Interface */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Test Message</label>
                <Textarea placeholder="Type a message to test your agent's response..." className="min-h-[100px]" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                "Hello, I need help with my order"
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                "What are your business hours?"
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                "I want to cancel my subscription"
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                "Tell me about your new features"
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Response Area */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] rounded-lg border bg-muted/50 p-4">
                <p className="text-muted-foreground text-center">Send a test message to see your agent's response</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Intent Detection</span>
                  <Badge variant="outline">--</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sentiment</span>
                  <Badge variant="outline">--</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
