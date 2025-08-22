import { createClient } from '@/lib/supabase/server'
import { getUserRestaurant } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SimpleNav from '@/components/SimpleNav'

export default async function OrdersPage() {
  const supabase = createClient()
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
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-600">Customer: {order.customer_name}</p>
                    <p className="text-sm text-gray-600">Total: ${order.total_amount}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'ready' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders yet. When customers place orders, they'll appear here!</p>
          </div>
        )}
      </div>
    </>
  )
}