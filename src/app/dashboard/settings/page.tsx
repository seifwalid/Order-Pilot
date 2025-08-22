import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRestaurant } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SimpleNav from '@/components/SimpleNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RestaurantSettingsForm from '@/components/RestaurantSettingsForm'
import StaffManagement from '@/components/StaffManagement'
import MenuManagement from '@/components/MenuManagement'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { restaurant, role } = await getUserRestaurant(user.id)

  if (!restaurant) {
    redirect('/onboarding')
  }

  // Fetch staff members with email using admin client
  const adminSupabase = createAdminClient()
  const { data: staffMembers } = await supabase
    .from('restaurant_staff')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)

  // Get emails for staff members
  const staffWithEmails = await Promise.all((staffMembers || []).map(async (staff) => {
    const { data: user } = await adminSupabase.auth.admin.getUserById(staff.user_id)
    return {
      ...staff,
      email: user.user?.email || 'Unknown'
    }
  }))

  // Fetch pending invitations (exclude expired ones)
  const { data: pendingInvitations } = await supabase
    .from('staff_invitations')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('status', 'pending')

  // Fetch menu categories and items
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      *,
      menu_items(*)
    `)
    .eq('restaurant_id', restaurant.id)
    .order('display_order')

  return (
    <>
      <SimpleNav user={user} role={role} />
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your restaurant settings, staff, and menu</p>
        </div>

        <Tabs defaultValue="restaurant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurant" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
                <CardDescription>
                  Update your restaurant's basic information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RestaurantSettingsForm restaurant={restaurant} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <StaffManagement 
              restaurant={restaurant}
              role={role}
              staffMembers={staffWithEmails || []}
              pendingInvitations={pendingInvitations || []}
            />
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <MenuManagement 
              restaurant={restaurant}
              role={role}
              categories={categories || []}
            />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>VAPI Voice Agent</CardTitle>
                <CardDescription>
                  Configure voice ordering through VAPI integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">🎤 VAPI Integration</p>
                  <p className="text-sm text-gray-600">
                    Voice agent integration coming soon. This will allow customers to place orders via phone calls.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Processing</CardTitle>
                <CardDescription>
                  Configure payment methods and processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">💳 Payment Integration</p>
                  <p className="text-sm text-gray-600">
                    Payment processing integration coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
