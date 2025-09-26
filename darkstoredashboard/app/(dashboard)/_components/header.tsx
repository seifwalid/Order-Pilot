"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "Agents" },
  { href: "#", label: "Analytics" },
  { href: "#", label: "Settings" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap px-10 py-4 bg-[#0A0F12]/80 backdrop-blur-md border-b border-solid border-primary/20">
      <div className="flex items-center gap-4">
        <div className="size-6 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight neon-text">AURA</h1>
      </div>
      <nav className="flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === link.href
              : link.href !== "#" && pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-300 hover:text-primary",
                isActive ? "text-primary" : "text-gray-400"
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="flex items-center justify-end gap-4">
        <Avatar className="h-10 w-10 border-2 border-primary/50 holographic-glow">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
