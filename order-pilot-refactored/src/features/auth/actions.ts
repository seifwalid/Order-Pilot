'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/onboarding')
}

export async function signup(formData: FormData) {
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Signup Error:', error)
    return redirect('/login?message=Could not authenticate user')
  }

  // This will redirect to a page that tells the user to check their email.
  // The email will contain a link that, once clicked, will redirect them to the onboarding page.
  return redirect('/login?message=Check email to continue sign in process')
}

export async function signInWithGoogle() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
        },
    })

    if (error) {
        console.error('Google Sign-In Error:', error)
        return redirect('/login?message=Could not authenticate with Google')
    }

    return redirect(data.url)
}
