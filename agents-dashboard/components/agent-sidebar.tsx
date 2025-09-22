"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, MessageSquare, Play, Settings, Code, ChevronLeft, Menu } from "lucide-react"

interface AgentSidebarProps {
  agentId: string
  agentName?: string
  agentAvatar?: string
  className?: string
}

const navigationItems = [
  {
    name: "Overview",
    href: "",
    icon: BarChart3,
    description: "Agent performance and metrics",
  },
  {
    name: "Interactions",
    href: "/calls",
    icon: MessageSquare,
    description: "View all conversations",
  },
  {
    name: "Playground",
    href: "/playground",
    icon: Play,
    description: "Test and experiment",
  },
  {
    name: "Settings",
    href: "/config",
    icon: Settings,
    description: "Configure agent behavior",
  },
  {
    name: "API",
    href: "/api",
    icon: Code,
    description: "Integration and endpoints",
  },
]

function SidebarContent({
  agentId,
  agentName = "Alex",
  agentAvatar,
  isCollapsed = false,
  onNavigate,
}: AgentSidebarProps & { isCollapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const basePath = `/dashboard/agents/${agentId}`

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={agentAvatar || "/placeholder.svg"} alt={agentName} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {agentName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm">{agentName}</span>
              <Badge variant="secondary" className="w-fit text-xs">
                Active
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const href = `${basePath}${item.href}`
            const isActive =
              pathname === href ||
              (item.href === "" && pathname === basePath) ||
              (item.href !== "" && pathname.startsWith(href))

            return (
              <Link key={item.name} href={href} onClick={onNavigate}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="text-xs opacity-70 font-normal">{item.description}</span>
                    </div>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Back to Agents */}
      <div className="p-2 border-t border-sidebar-border">
        <Link href="/dashboard/agents" onClick={onNavigate}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "justify-center px-2",
            )}
          >
            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">Back to Agents</span>}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function AgentSidebar({ agentId, agentName = "Alex", agentAvatar, className }: AgentSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden bg-background border shadow-md"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SidebarContent
              agentId={agentId}
              agentName={agentName}
              agentAvatar={agentAvatar}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {/* Collapse Toggle */}
        <div className="flex items-center justify-end p-2 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <SidebarContent agentId={agentId} agentName={agentName} agentAvatar={agentAvatar} isCollapsed={isCollapsed} />
      </div>
    </>
  )
}
