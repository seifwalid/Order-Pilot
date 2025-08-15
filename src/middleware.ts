import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next({
        request: { headers: req.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return req.cookies.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) {
                    res.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    res.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const { pathname } = req.nextUrl;

    // If user is not logged in, redirect to login page if they try to access protected routes
    if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding'))) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // If user is logged in, handle redirects
    if (user) {
        // If logged in user is on login page, redirect to dashboard
        if (pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Check if user is a staff member
        const { data: staffMember } = await supabase
            .from("restaurant_staff")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

        // If user is a staff member, they should not access onboarding
        if (staffMember && pathname.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // If user is not a staff member, they are an owner. Handle owner onboarding.
        if (!staffMember) {
            const { data: restaurant } = await supabase
                .from('restaurants')
                .select("onboarding_completed")
                .eq("owner_id", user.id)
                .single();
            
            // If owner has not completed onboarding, force them to the onboarding page
            if ((!restaurant || !restaurant.onboarding_completed) && !pathname.startsWith('/onboarding')) {
                return NextResponse.redirect(new URL('/onboarding', req.url));
            }

            // If owner has completed onboarding, they should not be able to go back
            if (restaurant && restaurant.onboarding_completed && pathname.startsWith('/onboarding')) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }
    }

    return res;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/onboarding',
        '/login',
    ],
}


