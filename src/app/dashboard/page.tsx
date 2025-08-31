import { createClient } from '@/lib/supabase/server'
import { getUserRestaurant } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package, 
  Eye,
  Calendar,
  Clock
} from 'lucide-react'

import SimpleNav from '@/components/SimpleNav'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { restaurant, role } = await getUserRestaurant(user.id)

  if (!restaurant) {
    redirect('/onboarding')
  }

  // Fetch analytics data
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurant.id)

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)

  // Calculate analytics
  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
  const totalItemsSold = orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
  const totalVisits = 0 // Placeholder
  const avgOrderValue = 0 // Placeholder

  // Generate sample sales data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const salesData = last7Days.map(date => ({
    date,
    sales: 0, // Placeholder
    orders: 0  // Placeholder
  }))

  return (
    <>
      <SimpleNav user={user} role={role} />
             <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                 <h1 className="text-2xl font-medium mb-6 text-white">Dashboard</h1>
      
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                                                                                                                                                                                       <div className="group bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50">
             <div className="flex items-start justify-between">
               <div className="space-y-3">
                 <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                   <p className="text-sm text-slate-300 font-medium">Total Orders</p>
                 </div>
                 <p className="text-3xl font-medium text-white">{totalOrders}</p>
                 <div className="flex items-center space-x-1">
                   <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                   <span className="text-xs text-emerald-400 font-medium">0%</span>
                   <span className="text-xs text-slate-400">from last month</span>
                 </div>
               </div>
               <div className="flex items-center justify-center">
                 <ShoppingCart className="w-6 h-6 text-blue-400" />
               </div>
             </div>
           </div>

                 <div className="group bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50">
           <div className="flex items-start justify-between">
             <div className="space-y-3">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                 <p className="text-sm text-slate-300 font-medium">Total Revenue</p>
               </div>
               <p className="text-3xl font-medium text-white">${totalRevenue.toFixed(2)}</p>
               <div className="flex items-center space-x-1">
                 <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                 </svg>
                 <span className="text-xs text-emerald-400 font-medium">0%</span>
                 <span className="text-xs text-slate-400">from last month</span>
               </div>
             </div>
                            <div className="flex items-center justify-center">
                 <DollarSign className="w-6 h-6 text-emerald-400" />
               </div>
           </div>
         </div>

                 <div className="group bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50">
           <div className="flex items-start justify-between">
             <div className="space-y-3">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                 <p className="text-sm text-slate-300 font-medium">Items Sold</p>
               </div>
               <p className="text-3xl font-medium text-white">{totalItemsSold}</p>
               <div className="flex items-center space-x-1">
                 <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                 </svg>
                 <span className="text-xs text-emerald-400 font-medium">0%</span>
                 <span className="text-xs text-slate-400">from last month</span>
               </div>
             </div>
                            <div className="flex items-center justify-center">
                 <Package className="w-6 h-6 text-purple-400" />
               </div>
           </div>
         </div>

                 <div className="group bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50">
           <div className="flex items-start justify-between">
             <div className="space-y-3">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                 <p className="text-sm text-slate-300 font-medium">Total Visits</p>
               </div>
               <p className="text-3xl font-medium text-white">__</p>
               <div className="flex items-center space-x-1">
                 <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                 </svg>
                 <span className="text-xs text-emerald-400 font-medium">0%</span>
                 <span className="text-xs text-slate-400">from last month</span>
               </div>
             </div>
                            <div className="flex items-center justify-center">
                 <Eye className="w-6 h-6 text-orange-400" />
               </div>
           </div>
         </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700 p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-medium text-white">Sales Overview</h3>
            <p className="text-sm text-white/70">Last 7 days performance</p>
          </div>
                     <div className="flex items-center space-x-2">
             <TrendingUp className="w-5 h-5 text-green-400" />
             <span className="text-sm text-green-400">__</span>
           </div>
        </div>
        
        <div className="space-y-4">
          {/* Sales Chart Bars */}
          <div className="flex items-end justify-between h-32 space-x-2">
            {salesData.map((day, index) => (
              <div key={day.date} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-500/60 to-blue-500/20 rounded-t-lg mb-2"
                     style={{ height: `${(day.sales / 600) * 100}%` }}>
                </div>
                <span className="text-xs text-white/70">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500/60 rounded"></div>
              <span className="text-white/70">Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500/60 rounded"></div>
              <span className="text-white/70">Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700 p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Avg Order Value</h4>
              <p className="text-sm text-white/70">Per transaction</p>
            </div>
          </div>
                     <p className="text-2xl font-bold text-white">__</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700 p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Customer Retention</h4>
              <p className="text-sm text-white/70">Returning customers</p>
            </div>
          </div>
                     <p className="text-2xl font-bold text-white">__</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700 p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Peak Hours</h4>
              <p className="text-sm text-white/70">Busiest time</p>
            </div>
          </div>
                     <p className="text-2xl font-bold text-white">__</p>
        </div>
      </div>

      {/* Original Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700 p-6 shadow-lg">
          <div className="flex flex-col space-y-1.5 mb-4">
            <h3 className="text-2xl font-medium leading-none tracking-tight text-white drop-shadow-sm">
              Welcome to OrderPilot!
            </h3>
            <p className="text-sm text-white/85">
              Your restaurant management system
            </p>
          </div>
          <div className="pt-0">
            <p className="text-sm text-white/90">
              Welcome back, {user.email}!
            </p>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700 p-6 shadow-lg">
          <div className="flex flex-col space-y-1.5 mb-4">
            <h3 className="text-2xl font-medium leading-none tracking-tight text-white drop-shadow-sm">
              Restaurant Info
            </h3>
            <p className="text-sm text-white/85">
              Basic details
            </p>
          </div>
          <div className="pt-0">
            <p className="text-white/90"><span className="font-medium text-white">Name:</span> {restaurant.name}</p>
            <p className="text-white/90"><span className="font-medium text-white">Email:</span> {restaurant.email}</p>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700 p-6 shadow-lg">
          <div className="flex flex-col space-y-1.5 mb-4">
            <h3 className="text-2xl font-medium leading-none tracking-tight text-white drop-shadow-sm">
              Your Role
            </h3>
            <p className="text-sm text-white/85">
              Access level
            </p>
          </div>
          <div className="pt-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-white/25 text-white/90 border border-white/40 capitalize">
              {role}
            </span>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}