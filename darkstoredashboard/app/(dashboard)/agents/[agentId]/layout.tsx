import type React from "react"
import { AgentSidebar } from "./_components/agent-sidebar"

export default function AgentLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { agentId: string }
}) {
    return (
        <>
            <AgentSidebar agentId={params.agentId} />
            <main 
                className="flex-1 p-8 overflow-y-auto transition-all duration-300" 
                style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
            >
                {children}
            </main>
        </>
    )
}
