'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EmailConfirmedPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if there's a pending invitation URL stored
    const pendingUrl = localStorage.getItem('pendingInvitationUrl')
    const pendingEmail = localStorage.getItem('pendingInvitationEmail')

    if (pendingUrl) {
      // Clear the stored data
      localStorage.removeItem('pendingInvitationUrl')
      localStorage.removeItem('pendingInvitationEmail')
      
      // Redirect to the invitation URL after a short delay
      setTimeout(() => {
        window.location.href = pendingUrl
      }, 2000)
    } else {
      // No pending invitation, redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Email Confirmed!</CardTitle>
          <CardDescription>
            Your email has been successfully confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600">
              Redirecting you back to complete your invitation...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
