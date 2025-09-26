"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, Lightbulb, Heart, MessageSquare, Zap, UserCheck, BookOpen, Puzzle, Mic, Play } from "lucide-react"

export default function SettingsPage({ params }: { params: { agentId: string } }) {
    const [activeTab, setActiveTab] = useState("behavior")
    const [voiceTone, setVoiceTone] = useState([80])
    const [responseSpeed, setResponseSpeed] = useState([75])
    const [emotionalInflection, setEmotionalInflection] = useState([50])
    const [advancedFeatures, setAdvancedFeatures] = useState(false)
    const [selectedVoiceType, setSelectedVoiceType] = useState("Warm")
    const [selectedPersonalities, setSelectedPersonalities] = useState(["storyteller"])

    const voiceTypes = ["Crisp", "Warm", "Smooth"]
    
    const behaviorModules = [
        { id: "greeting", name: "Greeting", icon: MessageSquare, active: true },
        { id: "support", name: "Support", icon: UserCheck, active: true },
        { id: "proactive", name: "Proactive", icon: Lightbulb, active: false },
        { id: "empathy", name: "Empathy", icon: Heart, active: true },
        { id: "api", name: "API Call", icon: Settings, active: false },
    ]

    const personalityTraits = [
        { id: "helpful", name: "Helpful", icon: UserCheck },
        { id: "insightful", name: "Insightful", icon: Lightbulb },
        { id: "empathetic", name: "Empathetic", icon: Heart },
        { id: "storyteller", name: "Storyteller", icon: BookOpen },
    ]

    const getToneLabel = (value: number) => {
        if (value < 25) return "Calm"
        if (value < 50) return "Balanced"
        if (value < 75) return "Enthusiastic"
        return "Energetic"
    }

    const getInflectionLabel = (value: number) => {
        if (value < 33) return "Subtle"
        if (value < 67) return "Moderate"
        return "Expressive"
    }

    const togglePersonality = (personalityId: string) => {
        setSelectedPersonalities(prev => 
            prev.includes(personalityId) 
                ? prev.filter(id => id !== personalityId)
                : [...prev, personalityId]
        )
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <div className="mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="behavior" className="flex items-center gap-2">
                        <Puzzle className="h-4 w-4" />
                        Behavior Modules
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Voice & Personality
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* Tab 1: Behavior Configuration (like agent-config-1.html) */}
            <TabsContent value="behavior" className="mt-0">
                <div className="flex h-full min-h-screen w-full">
                    {/* Sidebar */}
                    <aside className="flex w-96 flex-col border-r border-border bg-card/20 p-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Agent Configuration
                            </h1>
                            <p className="text-muted-foreground">Customize your agent's behavior.</p>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Behavior Modules */}
                            <div>
                                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                                    Behavior Modules
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {behaviorModules.map((module) => (
                                        <div
                                            key={module.id}
                                            className={`group flex cursor-grab flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                                module.active
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border bg-card hover:border-primary hover:bg-card/80"
                                            }`}
                                        >
                                            <module.icon className="h-8 w-8" />
                                            <h3 className="font-semibold">{module.name}</h3>
                                        </div>
                                    ))}
                                    <div className="group flex cursor-grab flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border bg-transparent p-4 text-muted-foreground transition-all hover:border-primary hover:text-foreground">
                                        <Plus className="h-8 w-8" />
                                        <h3 className="font-semibold">Add New</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Holographic Controls */}
                            <div>
                                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                                    Holographic Controls
                                </h2>
                                <div className="space-y-6 rounded-lg border border-border bg-card/50 p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="font-medium text-foreground">Voice Tone</label>
                                            <span className="text-sm font-semibold text-primary glow-number">45</span>
                                        </div>
                                        <Slider
                                            value={[45]}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="font-medium text-foreground">Response Speed</label>
                                            <span className="text-sm font-semibold text-primary glow-number">75</span>
                                        </div>
                                        <Slider
                                            value={responseSpeed}
                                            onValueChange={setResponseSpeed}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="font-medium text-foreground">Enable Advanced Features</span>
                                        <Switch
                                            checked={advancedFeatures}
                                            onCheckedChange={setAdvancedFeatures}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Preview */}
                    <main className="flex flex-1 flex-col items-center justify-center p-8">
                        <div className="w-full max-w-4xl text-center">
                            <h2 className="text-4xl font-bold tracking-tight text-foreground">
                                Agent Preview
                            </h2>
                            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                                Drag and drop modules to customize behavior. Your changes are
                                reflected on the avatar in real-time.
                            </p>
                        </div>
                        <div className="mt-12 flex w-full max-w-lg items-center justify-center">
                            <div className="aspect-[3/4] w-full rounded-2xl bg-card/20 ring-1 ring-inset ring-border transition-all duration-500 hover:scale-105">
                                <div 
                                    className="h-full w-full rounded-2xl bg-cover bg-center bg-no-repeat" 
                                    style={{
                                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfx0hH5II7KTd6N9EkMA2PJnDWUxmH0GyoF8AXNSjXrQ-JFcLmAINKoaY12XB0e2cLBjaXnHzcW_lC9t3TzOUrgAgGKS99__ea7Xo9yDuHdj0od-2UY1NOFonwzZo87b4Wr8l3chwMHWqUKbuDuAKZS8VLnZCzxBQb5-H9sUrC1Bpg-5Ln3vSdJVq0MzTtMWj6hkbu4hUm-HYpKcF2iSeDGL0f5dm_QIPtkIkkWtE-Jvr7tTog3TNut3shaFPtvflcc8RXVCSUkGM')"
                                    }}
                                ></div>
                            </div>
                        </div>
                    </main>
                </div>
            </TabsContent>

            {/* Tab 2: Voice & Personality Configuration (like agent-config-2.html) */}
            <TabsContent value="voice" className="mt-0">
                <div className="flex h-full min-h-screen w-full">
                    {/* Sidebar */}
                    <aside className="flex w-[420px] flex-col border-r border-border bg-card/20 p-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Agent Configuration
                            </h1>
                            <p className="text-muted-foreground">Customize your agent's voice and personality.</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            {/* Voice Customization */}
                            <div>
                                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                                    Voice Customization
                                </h2>
                                <div className="space-y-6 rounded-lg border border-border bg-card/50 p-4">
                                    <div className="space-y-3">
                                        <label className="font-medium text-foreground">Voice Type</label>
                                        <div className="flex gap-2">
                                            {voiceTypes.map((type) => (
                                                <Button
                                                    key={type}
                                                    variant={selectedVoiceType === type ? "default" : "outline"}
                                                    className="flex-1"
                                                    onClick={() => setSelectedVoiceType(type)}
                                                >
                                                    {type}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="font-medium text-foreground">Tone</label>
                                            <span className="text-sm font-semibold text-primary glow-metric">Enthusiastic</span>
                                        </div>
                                        <Slider
                                            value={voiceTone}
                                            onValueChange={setVoiceTone}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="font-medium text-foreground">Emotional Inflection</label>
                                            <span className="text-sm font-semibold text-primary glow-metric">Moderate</span>
                                        </div>
                                        <Slider
                                            value={emotionalInflection}
                                            onValueChange={setEmotionalInflection}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Agent Personality */}
                            <div>
                                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                                    Agent Personality
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {personalityTraits.map((trait) => (
                                        <div
                                            key={trait.id}
                                            className={`group flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                                selectedPersonalities.includes(trait.id)
                                                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/50"
                                                    : "border-border bg-card hover:border-primary hover:bg-card/80"
                                            }`}
                                            onClick={() => togglePersonality(trait.id)}
                                        >
                                            <trait.icon className="h-8 w-8" />
                                            <h3 className="font-semibold">{trait.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Preview */}
                    <main className="flex flex-1 flex-col items-center justify-center p-8">
                        <div className="relative w-full max-w-4xl text-center">
                            <div className="absolute -top-24 left-1/2 -translate-x-1/2 transform">
                                <div className="aspect-square w-64 rounded-full bg-card/20 ring-1 ring-inset ring-border transition-all duration-500 hover:scale-105 hover:ring-primary">
                                    <div 
                                        className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat" 
                                        style={{
                                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfx0hH5II7KTd6N9EkMA2PJnDWUxmH0GyoF8AXNSjXrQ-JFcLmAINKoaY12XB0e2cLBjaXnHzcW_lC9t3TzOUrgAgGKS99__ea7Xo9yDuHdj0od-2UY1NOFonwzZo87b4Wr8l3chwMHWqUKbuDuAKZS8VLnZCzxBQb5-H9sUrC1Bpg-5Ln3vSdJVq0MzTtMWj6hkbu4hUm-HYpKcF2iSeDGL0f5dm_QIPtkIkkWtE-Jvr7tTog3TNut3shaFPtvflcc8RXVCSUkGM')"
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="mt-48 rounded-2xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-sm">
                                <h2 className="text-2xl font-bold tracking-tight text-primary">
                                    A Story from Your Customers
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground">
                                    "Last week, we saw a <span className="font-bold text-primary glow-percentage">15% increase</span> in calls about our new 'Quantum Leap' feature. Many customers, like Sarah from P-Corp, felt excited but a bit lost. By adjusting my tone to be more <span className="font-bold text-primary glow-metric">enthusiastic</span> and providing <span className="font-bold text-primary glow-metric">step-by-step guidance</span>, we turned confusion into confidence, leading to a <span className="font-bold text-primary glow-percentage">10% boost in feature adoption</span>. Let's keep this momentum going!"
                                </p>
                                <div className="mt-6">
                                    <Button size="lg" className="px-8">
                                        <Play className="mr-2 h-5 w-5" />
                                        Hear the story
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </TabsContent>
        </Tabs>
    )
}
