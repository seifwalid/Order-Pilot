"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { BarChart3, MessageSquare, Play, Settings, Code, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sidebarNavItems = [
    {
        title: "Overview",
        href: "",
        icon: BarChart3,
    },
    {
        title: "Calls",
        href: "calls",
        icon: MessageSquare,
    },
    {
        title: "Playground",
        href: "playground",
        icon: Play,
    },
    {
        title: "Settings",
        href: "settings",
        icon: Settings,
    },
    {
        title: "API",
        href: "api",
        icon: Code,
    },
]

export function AgentSidebar({ agentId }: { agentId: string }) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showTooltips, setShowTooltips] = useState(false)
    const segments = pathname.split("/")
    const currentSubpage = segments.length > 3 ? segments[segments.length - 1] : ""

    const baseHref = `/agents/${agentId}`

    // Handle tooltip visibility with proper timing
    useEffect(() => {
        if (isCollapsed) {
            // Delay showing tooltips until after the collapse animation completes
            const timer = setTimeout(() => setShowTooltips(true), 300)
            return () => clearTimeout(timer)
        } else {
            // Hide tooltips immediately when expanding
            setShowTooltips(false)
        }
    }, [isCollapsed])

    const handleToggleCollapse = () => {
        setShowTooltips(false) // Hide tooltips immediately when toggling
        setIsCollapsed(!isCollapsed)
    }

    // Update CSS custom property for sidebar width
    useEffect(() => {
        document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '80px' : '288px')
    }, [isCollapsed])

    return (
        <TooltipProvider>
            <div
                className={cn(
                    "fixed left-0 top-[65px] bottom-0 z-40 flex flex-col border-r bg-card transition-all duration-300",
                    isCollapsed ? "w-20" : "w-72"
                )}
            >
                {/* Header */}
                <div className="flex h-[65px] items-center justify-between border-b px-6">
                    <Link className={cn("flex items-center gap-2 font-semibold", isCollapsed && "pointer-events-none")} href="#">
                        <span className={cn(isCollapsed ? "hidden" : "")}>Agent {agentId}</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={handleToggleCollapse}>
                        <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-4">
                    {sidebarNavItems.map((item) => {
                        const href = item.href ? `${baseHref}/${item.href}` : baseHref
                        const isActive = currentSubpage === item.href

                        const NavigationButton = (
                            <Link href={href}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn("w-full justify-start gap-3", isCollapsed && "justify-center px-2")}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className={cn("text-base", isCollapsed ? "hidden" : "")}>
                                        {item.title}
                                    </span>
                                </Button>
                            </Link>
                        )

                        // Only wrap with tooltip if collapsed and tooltips should be shown
                        if (isCollapsed && showTooltips) {
                            return (
                                <Tooltip key={item.title} delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        {NavigationButton}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="flex items-center gap-4">
                                        {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        }

                        return <div key={item.title}>{NavigationButton}</div>
                    })}
                </nav>

                {/* Collapse Toggle */}
                <div className="mt-auto border-t p-4">
                </div>
            </div>
        </TooltipProvider>
    )
}
