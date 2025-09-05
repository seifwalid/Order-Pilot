import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRestaurant } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SimpleNav from '@/components/SimpleNav'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RestaurantSettingsForm from '@/components/RestaurantSettingsForm'
import StaffManagement from '@/components/StaffManagement'
import MenuManagement from '@/components/MenuManagement'
import ThemeSettings from '@/components/ThemeSettings'

export default async function SettingsPage() {
  const supabase = await createClient()
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
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-white">Settings</h1>
          <p className="text-white/90">Manage your restaurant settings, staff, and menu</p>
        </div>

        <Tabs defaultValue="restaurant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-3xl rounded-xl border border-slate-700/50 p-1 shadow-lg">
            <TabsTrigger 
              value="restaurant"
              className="text-white/85 data-[state=active]:bg-white/25 data-[state=active]:text-white rounded-lg"
            >
              Restaurant
            </TabsTrigger>
            <TabsTrigger 
              value="staff"
              className="text-white/85 data-[state=active]:bg-white/25 data-[state=active]:text-white rounded-lg"
            >
              Staff
            </TabsTrigger>
            <TabsTrigger 
              value="menu"
              className="text-white/85 data-[state=active]:bg-white/25 data-[state=active]:text-white rounded-lg"
            >
              Menu
            </TabsTrigger>
            <TabsTrigger 
              value="theme"
              className="text-white/85 data-[state=active]:bg-white/25 data-[state=active]:text-white rounded-lg"
            >
              Theme
            </TabsTrigger>
            <TabsTrigger 
              value="integrations"
              className="text-white/85 data-[state=active]:bg-white/25 data-[state=active]:text-white rounded-lg"
            >
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurant" className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-3xl rounded-xl border border-slate-700/50 p-6 shadow-lg">
              <div className="flex flex-col space-y-1.5 mb-4">
                <h3 className="text-2xl font-medium leading-none tracking-tight text-white drop-shadow-sm">
                  Restaurant Information
                </h3>
                <p className="text-sm text-white/85">
                  Update your restaurant's basic information and contact details
                </p>
              </div>
              <div className="pt-0">
                <RestaurantSettingsForm restaurant={restaurant} />
              </div>
            </div>
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

          <TabsContent value="theme" className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-3xl rounded-xl border border-slate-700/50 p-6 shadow-lg">
              <div className="flex flex-col space-y-1.5 mb-6">
                <h3 className="text-2xl font-medium leading-none tracking-tight text-white drop-shadow-sm">
                  Theme & Appearance
                </h3>
                <p className="text-sm text-white/85">
                  Customize your dashboard's appearance and accent colors
                </p>
              </div>
              <ThemeSettings />
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-3xl rounded-xl border border-slate-700/50 p-6 shadow-lg">
              <div className="flex flex-col space-y-1.5 mb-4">
                <h3 className="text-2xl font-medium leading-none tracking-tight text-white drop-shadow-sm">
                  VAPI Voice Agent
                </h3>
                <p className="text-sm text-white/85">
                  Configure voice ordering through VAPI integration
                </p>
              </div>
              <div className="pt-0">
                <div className="text-center py-8">
                  <p className="text-white/90 mb-4">🎤 VAPI Integration</p>
                  <p className="text-sm text-white/85">
                    Voice agent integration coming soon. This will allow customers to place orders via phone calls.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-3xl rounded-xl border border-slate-700/50 p-6 shadow-lg">
              <div className="flex flex-col space-y-1.5 mb-4">
                <h3 className="text-2xl font-medium leading-none tracking-tight text-white drop-shadow-sm">
                  Payment Processing
                </h3>
                <p className="text-sm text-white/85">
                  Configure payment methods and processing
                </p>
              </div>
              <div className="pt-0">
                <div className="text-center py-8">
                  <p className="text-white/90 mb-4">💳 Payment Integration</p>
                  <p className="text-sm text-white/85">
                    Payment processing integration coming soon.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
