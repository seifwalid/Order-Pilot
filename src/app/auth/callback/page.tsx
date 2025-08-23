'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true
    
    const handleAuthCallback = async () => {
      if (!isMounted) return
      try {
        console.log('🔍 Auth callback - handling Supabase session')
        console.log('🔍 Current URL:', window.location.href)
        console.log('🔍 Hash params:', window.location.hash)
        
        // Handle the session from URL hash parameters
        const { data, error } = await supabase.auth.getSession()
        console.log('🔍 Current session:', data.session?.user?.email || 'No session')
        
        if (error) {
          console.error('❌ Auth callback error:', error)
          router.push('/login?error=' + encodeURIComponent(error.message))
          return
        }
        
        // If no current session, try to refresh or handle hash
        if (!data.session) {
          console.log('🔄 No session found, checking for hash tokens...')
          
          // Check if we have hash parameters with tokens
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            console.log('🔄 Setting session from hash tokens...')
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (sessionError) {
              console.error('❌ Failed to set session:', sessionError)
              router.push('/login?error=' + encodeURIComponent(sessionError.message))
              return
            }
            
            console.log('✅ Session set from tokens:', sessionData.session?.user?.email)
          } else {
            console.log('⚠️ No tokens found in hash')
            router.push('/login?error=' + encodeURIComponent('No authentication tokens found'))
            return
          }
        }

        // Get the final session (either existing or newly set)
        const { data: finalData } = await supabase.auth.getSession()
        const session = finalData.session
        
        if (session) {
          console.log('✅ Session established:', session.user.email)
          
          // Check if this is a staff invitation
          const supabaseInvite = searchParams.get('supabase_invite')
          const email = searchParams.get('email')
          const nextPath = searchParams.get('next')
          
          console.log('🔍 Auth callback redirect logic:', {
            supabaseInvite,
            email,
            nextPath,
            isStaffInvite: supabaseInvite === 'true' && email && nextPath === '/staff-onboarding'
          })
          
          if (supabaseInvite === 'true' && email && nextPath === '/staff-onboarding') {
            console.log('✅ Redirecting to staff onboarding with hash tokens preserved')
            
            // Extract tokens from current hash
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const accessToken = hashParams.get('access_token')
            const refreshToken = hashParams.get('refresh_token')
            const type = hashParams.get('type')
            
            // Build URL with all necessary parameters
            const targetUrl = `/staff-onboarding?email=${encodeURIComponent(email)}&supabase_invite=true&access_token=${encodeURIComponent(accessToken || '')}&refresh_token=${encodeURIComponent(refreshToken || '')}&type=${encodeURIComponent(type || '')}`
            
            console.log('🔗 Target URL:', targetUrl)
            router.push(targetUrl)
          } else {
            console.log('❌ Redirecting to dashboard (not a staff invite)')
            router.push('/dashboard')
          }
        } else {
          console.log('⚠️ No session found after all attempts')
          router.push('/login?error=' + encodeURIComponent('Authentication failed'))
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error)
        router.push('/login?error=' + encodeURIComponent('Authentication failed'))
      }
    }

    handleAuthCallback()
    
    return () => {
      isMounted = false
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing invitation...</h2>
        <p className="text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  )
}
