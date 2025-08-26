import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getUserRestaurant(userId: string) {
  const supabase = createClient()
  
  // First check if user owns a restaurant
  const { data: ownedRestaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', userId)
    .single()

  if (ownedRestaurant) {
    return { restaurant: ownedRestaurant, role: 'owner' as const }
  }

  // Then check if user is staff at a restaurant
  const { data: staffData } = await supabase
    .from('restaurant_staff')
    .select(`
      role,
      restaurant:restaurants(*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (staffData?.restaurant) {
    return { restaurant: staffData.restaurant, role: staffData.role }
  }

  return { restaurant: null, role: null }
}
