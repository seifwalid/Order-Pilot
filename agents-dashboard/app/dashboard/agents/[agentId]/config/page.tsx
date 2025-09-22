"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Puzzle, HeadphonesIcon, Lightbulb, Brain, Database, Plus, BookOpen, PlayCircle } from "lucide-react"

const behaviorModules = [
  { id: "greeting", name: "Greeting", icon: Puzzle, active: true },
  { id: "support", name: "Support", icon: HeadphonesIcon, active: true },
  { id: "proactive", name: "Proactive", icon: Lightbulb, active: false },
  { id: "empathy", name: "Empathy", icon: Brain, active: true },
  { id: "api", name: "API Call", icon: Database, active: false },
]

const personalityTraits = [
  { id: "helpful", name: "Helpful", icon: HeadphonesIcon, active: true },
  { id: "insightful", name: "Insightful", icon: Lightbulb, active: false },
  { id: "empathetic", name: "Empathetic", icon: Brain, active: true },
  { id: "storyteller", name: "Storyteller", icon: BookOpen, active: true },
]

export default function AgentConfigPage() {
  const [voiceTone, setVoiceTone] = useState([45])
  const [responseSpeed, setResponseSpeed] = useState([75])
  const [tone, setTone] = useState([80])
  const [emotionalInflection, setEmotionalInflection] = useState([50])
  const [advancedFeatures, setAdvancedFeatures] = useState(false)
  const [selectedVoiceType, setSelectedVoiceType] = useState("warm")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Agent Settings</h1>
        <p className="text-muted-foreground">Configure behavior, voice, and personality traits</p>
      </div>

      <Tabs defaultValue="behavior" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="behavior">Behavior Config</TabsTrigger>
          <TabsTrigger value="voice">Voice Config</TabsTrigger>
        </TabsList>

        <TabsContent value="behavior" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Behavior Modules */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-semibold">Behavior Modules</h2>
                <div className="grid grid-cols-2 gap-4">
                  {behaviorModules.map((module) => {
                    const Icon = module.icon
                    return (
                      <Card
                        key={module.id}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          module.active ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <CardContent className="flex flex-col items-center gap-3 p-4">
                          <Icon className="h-8 w-8 text-primary" />
                          <h3 className="font-semibold text-center">{module.name}</h3>
                        </CardContent>
                      </Card>
                    )
                  })}
                  <Card className="cursor-pointer border-dashed transition-all hover:border-primary">
                    <CardContent className="flex flex-col items-center gap-3 p-4 text-muted-foreground">
                      <Plus className="h-8 w-8" />
                      <h3 className="font-semibold">Add New</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold">Controls</h2>
                <Card>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium">Voice Tone</label>
                        <span className="text-sm font-semibold text-primary">{voiceTone[0]}</span>
                      </div>
                      <Slider value={voiceTone} onValueChange={setVoiceTone} max={100} step={1} className="w-full" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium">Response Speed</label>
                        <span className="text-sm font-semibold text-primary">{responseSpeed[0]}</span>
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
                      <span className="font-medium">Enable Advanced Features</span>
                      <Switch checked={advancedFeatures} onCheckedChange={setAdvancedFeatures} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Agent Preview */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">Agent Preview</h2>
                <p className="text-muted-foreground mb-8 text-balance">Your changes are reflected in real-time</p>
                <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border bg-muted shadow-lg">
                  <img src="/agent-config-preview.png" alt="Agent Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Voice Configuration */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-semibold">Voice Customization</h2>
                <Card>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-3">
                      <label className="font-medium">Voice Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["crisp", "warm", "smooth"].map((type) => (
                          <Button
                            key={type}
                            variant={selectedVoiceType === type ? "default" : "outline"}
                            className="capitalize"
                            onClick={() => setSelectedVoiceType(type)}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium">Tone</label>
                        <span className="text-sm font-semibold text-primary">Enthusiastic</span>
                      </div>
                      <Slider value={tone} onValueChange={setTone} max={100} step={1} className="w-full" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium">Emotional Inflection</label>
                        <span className="text-sm font-semibold text-primary">Moderate</span>
                      </div>
                      <Slider
                        value={emotionalInflection}
                        onValueChange={setEmotionalInflection}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold">Agent Personality</h2>
                <div className="grid grid-cols-2 gap-4">
                  {personalityTraits.map((trait) => {
                    const Icon = trait.icon
                    return (
                      <Card
                        key={trait.id}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          trait.active ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <CardContent className="flex flex-col items-center gap-3 p-4">
                          <Icon className="h-8 w-8 text-primary" />
                          <h3 className="font-semibold text-center">{trait.name}</h3>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Voice Preview */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md text-center">
                <div className="aspect-square w-48 mx-auto mb-6 overflow-hidden rounded-full border bg-muted shadow-lg">
                  <img src="/agent-voice-avatar.png" alt="Voice Agent Avatar" className="h-full w-full object-cover" />
                </div>

                <Card className="border bg-card/50 p-6 shadow-lg backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-primary mb-4">Customer Story</h2>
                  <p className="text-sm text-balance mb-4">
                    "Last week, we saw a <span className="font-bold">15% increase</span> in calls about our new 'Quantum
                    Leap' feature. By adjusting my tone to be more <span className="font-bold">enthusiastic</span>, we
                    turned confusion into confidence, leading to a{" "}
                    <span className="font-bold">10% boost in feature adoption</span>."
                  </p>
                  <Button className="gap-2" size="sm">
                    <PlayCircle className="h-4 w-4" />
                    Hear the story
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
