'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

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
                   <nav className="bg-slate-900/95 backdrop-blur-xl shadow-sm border-b border-slate-700/50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
           <div className="flex items-center space-x-12">
             <Link href="/dashboard" className="text-xl font-bold text-white">
                OrderPilot
              </Link>
             
             <div className="flex space-x-6">
                              <Link 
                  href="/dashboard" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === '/dashboard' 
                      ? 'text-white bg-slate-700/50' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/orders" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === '/dashboard/orders' 
                      ? 'text-white bg-slate-700/50' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Orders
                </Link>
                {(role === 'owner' || role === 'manager') && (
                  <Link 
                    href="/dashboard/menu" 
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname === '/dashboard/menu' 
                        ? 'text-white bg-slate-700/50' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Menu
                  </Link>
                )}
                <Link 
                  href="/dashboard/settings" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === '/dashboard/settings' 
                      ? 'text-white bg-slate-700/50' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Settings
                </Link>
             </div>
           </div>
           
           <div className="flex items-center space-x-6">
             <span className="text-sm text-slate-300">{user.email}</span>
             <Button 
               variant="outline" 
               size="sm" 
               onClick={handleSignOut}
               className="border-slate-600 text-black bg-white hover:bg-gray-100 hover:border-slate-500"
             >
               Sign Out
             </Button>
           </div>
         </div>
       </div>
     </nav>
  )
}
