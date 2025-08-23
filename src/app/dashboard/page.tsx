import { createClient } from '@/lib/supabase/server'
import { getUserRestaurant } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

  return (
    <>
      <SimpleNav user={user} role={role} />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to OrderPilot!</CardTitle>
            <CardDescription>Your restaurant management system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Welcome back, {user.email}!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restaurant Info</CardTitle>
            <CardDescription>Basic details</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {restaurant.name}</p>
            <p><strong>Email:</strong> {restaurant.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Role</CardTitle>
            <CardDescription>Access level</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {role}
            </span>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  )
}