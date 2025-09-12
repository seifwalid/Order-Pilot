'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import {
  Bell,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Settings,
  Menu,
  X,
  User,
  ChefHat
} from 'lucide-react'
import { applyTheme } from '@/lib/theme/accent'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  restaurant: any
  role: string
}

export default function DashboardLayout({ children, user, restaurant, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Load and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('orderpilot_theme')
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        // Ensure all theme properties have default values for backward compatibility
        const themeWithDefaults = {
          mode: (parsed.mode as 'default' | 'light' | 'dark' | 'auto') || 'default',
          accent: parsed.accent || '#ae8d5e',
        }
        applyTheme(themeWithDefaults)
      } catch (error) {
        console.error('Failed to parse saved theme:', error)
        // Apply default theme
        applyTheme({ mode: 'default', accent: '#ae8d5e' })
      }
    } else {
      // Apply default theme
      applyTheme({ mode: 'default', accent: '#ae8d5e' })
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['owner', 'manager', 'staff'] },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, roles: ['owner', 'manager', 'staff'] },
    { name: 'Menu', href: '/dashboard/menu', icon: ChefHat, roles: ['owner', 'manager'] },
    { name: 'Staff', href: '/dashboard/staff', icon: Users, roles: ['owner', 'manager'] },
    { name: 'VAPI', href: '/dashboard/vapi', icon: LineChart, roles: ['owner'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['owner'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(role as any)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-background/95 backdrop-blur-xl border-r border-border shadow-xl">
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="OrderPilot Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-foreground">
                OrderPilot
              </h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-foreground hover:bg-muted">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-accent text-accent-foreground shadow-lg'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-background/95 backdrop-blur-xl border-r border-border">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="OrderPilot Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-foreground">
                OrderPilot
              </h1>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-accent text-accent-foreground shadow-lg'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-x-4">
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-foreground">{restaurant.name}</h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="hidden sm:flex items-center text-sm text-muted-foreground">
              <span className="capitalize">{role}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground shadow-lg">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || user.email}
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

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
