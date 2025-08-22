'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface SimpleNavProps {
  user: any
  role: string
}

export default function SimpleNav({ user, role }: SimpleNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              OrderPilot
            </Link>
            
            <div className="flex space-x-4">
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/orders" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Orders
              </Link>
              {(role === 'owner' || role === 'manager') && (
                <Link 
                  href="/dashboard/menu" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Menu
                </Link>
              )}
              <Link 
                href="/dashboard/settings" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Settings
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
