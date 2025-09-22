import type React from "react"
import { AgentSidebar } from "@/components/agent-sidebar"

interface AgentLayoutProps {
  children: React.ReactNode
  params: { agentId: string }
}

export default function AgentLayout({ children, params }: AgentLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AgentSidebar agentId={params.agentId} agentName="Alex" agentAvatar="/agent-avatar-detailed.png" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pt-16 lg:pt-6">{children}</main>
      </div>
    </div>
  )
}
