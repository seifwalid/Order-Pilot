import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // Create a Supabase client configured to use cookies
    const response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options) {
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if the user is a staff member first
        const { data: staffMember, error: staffError } = await supabase
          .from("restaurant_staff")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (staffMember) {
          // If they are a staff member, send them directly to the dashboard
          const redirectResponse = NextResponse.redirect(new URL('/dashboard', origin));
          response.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie);
          });
          return redirectResponse;
        }

        // If not a staff member, check if they are an owner
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("onboarding_completed")
          .eq("owner_id", user.id)
          .single();

        let destination = '/dashboard';
        if (!restaurant || !restaurant.onboarding_completed) {
          destination = '/onboarding';
        }
        
        const redirectResponse = NextResponse.redirect(new URL(destination, origin));
        response.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie);
        });
        return redirectResponse;
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login`);
}


