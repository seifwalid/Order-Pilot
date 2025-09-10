'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'

interface SimpleNavProps {
  user: any
  role: string
}

export default function SimpleNav({ user, role }: SimpleNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <img 
                src="/images/logo.png" 
                alt="OrderPilot Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="hidden font-bold sm:inline-block">
                OrderPilot
              </span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-accent-foreground bg-accent' 
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/orders" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/dashboard/orders' 
                  ? 'text-accent-foreground bg-accent' 
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Orders
            </Link>
            {(role === 'owner' || role === 'manager') && (
              <Link 
                href="/dashboard/menu" 
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/dashboard/menu' 
                    ? 'text-accent-foreground bg-accent' 
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                }`}
              >
                Menu
              </Link>
            )}
            <Link 
              href="/dashboard/settings" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/dashboard/settings' 
                  ? 'text-accent-foreground bg-accent' 
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Settings
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <span className="text-sm text-muted-foreground capitalize">{role}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                    <User className="h-4 w-4 text-accent-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
    </header>
  )
}
