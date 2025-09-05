import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for API routes and static assets to prevent unnecessary processing
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  // Allow unauthenticated access to auth pages and home
  const publicPaths = ['/', '/login', '/signup', '/auth/callback', '/staff-onboarding']
  const publicApiPaths = ['/api/staff/verify-invitation']
  const isPublicPath = publicPaths.includes(pathname) || 
                      pathname.startsWith('/staff-onboarding') ||
                      publicApiPaths.includes(pathname)

  // Redirect unauthenticated users to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Allow /auth/callback to proceed without middleware interference
  if (pathname === '/auth/callback') {
    console.log('🔄 Allowing auth callback to proceed')
    return supabaseResponse
  }

  // DISABLED: Supabase staff invitation redirect - handled by auth/callback directly
  // Redirect authenticated users away from login page
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from signup page
  if (user && pathname === '/signup') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Skip restaurant access checks for staff-onboarding page  
  if (pathname === '/staff-onboarding') {
    console.log('🔄 Allowing staff-onboarding page to proceed')
    return supabaseResponse
  }

  // Allow onboarding pages to proceed without restaurant access checks
  if (pathname === '/onboarding' || pathname === '/onboarding/v2') {
    console.log('🔄 Allowing onboarding page to proceed')
    return supabaseResponse
  }

  // Check restaurant access for dashboard routes 
  if (user && pathname.startsWith('/dashboard')) {
    // Check if user has a restaurant or is staff at a restaurant
    const { data: ownedRestaurant } = await supabase
      .from('restaurants')
      .select('id, onboarding_completed')
      .eq('owner_id', user.id)
      .maybeSingle()

    const { data: staffRestaurant } = await supabase
      .from('restaurant_staff')
      .select('restaurant_id, restaurants(id, onboarding_completed)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    // Handle restaurant data - could be single object or array
    let restaurant: any = null
    let onboardingCompleted = false
    
    if (ownedRestaurant) {
      restaurant = ownedRestaurant
      onboardingCompleted = ownedRestaurant.onboarding_completed
    } else if (staffRestaurant?.restaurants) {
      // Handle case where restaurants could be an array
      const staffRestaurantData = Array.isArray(staffRestaurant.restaurants) 
        ? staffRestaurant.restaurants[0] 
        : staffRestaurant.restaurants
      restaurant = staffRestaurantData
      onboardingCompleted = staffRestaurantData?.onboarding_completed
    }
    
    // If user has no restaurant access, redirect to onboarding (owner) or staff-onboarding (if pending invite)
    if (!restaurant) {
      // Check if user has a pending staff invitation
      const { data: pendingInvitation } = await supabase
        .from('staff_invitations')
        .select('id, restaurant_id')
        .eq('email', user.email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (pendingInvitation) {
        console.log('🔄 Redirecting to staff onboarding for pending invitation')
        const url = request.nextUrl.clone()
        url.pathname = '/staff-onboarding'
        url.searchParams.set('token', pendingInvitation.id)
        return NextResponse.redirect(url)
      } else {
        console.log('🔄 Redirecting to owner onboarding (no restaurant or pending invite)')
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding/v2'
        console.log('🎯 Redirecting to:', url.pathname)
        return NextResponse.redirect(url)
      }
    }

    // If restaurant exists but onboarding not completed, redirect to onboarding
    if (!onboardingCompleted && pathname !== '/onboarding' && pathname !== '/onboarding/v2') {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/v2'
      console.log('🎯 Redirecting to (incomplete onboarding):', url.pathname)
      return NextResponse.redirect(url)
    }

    // If onboarding completed but user is on onboarding page, redirect to dashboard
    if (onboardingCompleted && (pathname === '/onboarding' || pathname === '/onboarding/v2')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Handle staff invitation acceptance - allow access without authentication
  if (pathname.startsWith('/staff-onboarding')) {
    const token = request.nextUrl.searchParams.get('token')
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'Missing invitation token')
      return NextResponse.redirect(url)
    }

    // Note: We'll verify the token in the component itself, not in middleware
    // This allows unauthenticated access to the invitation page
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
