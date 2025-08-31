import { createClient } from '@/lib/supabase/server'
import { getUserRestaurant } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SimpleNav from '@/components/SimpleNav'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { restaurant, role } = await getUserRestaurant(user.id)

  if (!restaurant) {
    redirect('/onboarding')
  }

  // Fetch orders for this restaurant
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      customers(name, phone, email)
    `)
    .eq('restaurant_id', restaurant.id)
    .order('placed_at', { ascending: false })

  return (
    <>
      <SimpleNav user={user} role={role} />
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <h1 className="text-2xl font-bold mb-6 text-white">Orders</h1>
        
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/15 backdrop-blur-xl p-4 rounded-xl border border-white/30 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white drop-shadow-sm">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-white/85">Customer: {order.customer_name}</p>
                    <p className="text-sm text-white/85">Total: ${order.total_amount}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-normal ${
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    order.status === 'preparing' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    order.status === 'ready' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    'bg-white/20 text-white/80 border border-white/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/85">No orders yet. When customers place orders, they'll appear here!</p>
          </div>
        )}
      </div>
    </>
  )
}