'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    // Always redirect to V2 onboarding
    // The old onboarding frontend has been replaced with V2
    // All backend logic remains intact in the API routes
    router.push('/onboarding/v2')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to onboarding...</p>
      </div>
    </div>
  )
}