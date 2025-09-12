import { createClient } from '@/lib/supabase/server'
import { getUserRestaurant } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrdersBoard from '@/components/OrdersBoard'
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

  return (
    <>
      <SimpleNav user={user} role={role} />
      <div className="p-8 min-h-screen bg-background text-foreground">
        <div className="mb-6">
          <h1 className="text-2xl font-medium">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <OrdersBoard restaurantId={restaurant.id} />
      </div>
    </>
  )
}