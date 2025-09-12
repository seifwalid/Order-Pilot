'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StaffOnboardingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [invitation, setInvitation] = useState<any>(null)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showOnboardingForm, setShowOnboardingForm] = useState(false)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [showPasswordSetup, setShowPasswordSetup] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [passwordSetupForm, setPasswordSetupForm] = useState({
    password: '',
    confirmPassword: ''
  })

  // Onboarding form data
  const [onboardingData, setOnboardingData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    phoneNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    startDate: new Date().toISOString().split('T')[0], // Today's date
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Get parameters from both search params and hash
  const [hashParams, setHashParams] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // Parse hash parameters on client side
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const hashData: Record<string, string> = {}
      params.forEach((value, key) => {
        hashData[key] = value
      })
      setHashParams(hashData)
    }
  }, [])

  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const supabaseInviteFlag = searchParams.get('supabase_invite')
  
  // Get auth tokens from hash or search params (fallback to query params from auth callback)
  const accessToken = hashParams.access_token || searchParams.get('access_token')
  const refreshToken = hashParams.refresh_token || searchParams.get('refresh_token')
  const type = hashParams.type || searchParams.get('type')

  // Check if this is a Supabase invitation (will be recalculated when hashParams updates)
  const isSupabaseInvite = (accessToken && refreshToken && type === 'invite') || (email && supabaseInviteFlag === 'true')
  
  // Debug URL parameters - only log when hashParams are loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(hashParams).length > 0) {
      console.log('🔍 Supabase Invitation Check (with hash params):', {
        email,
        supabaseInviteFlag,
        accessToken: accessToken ? 'present' : 'missing',
        refreshToken: refreshToken ? 'present' : 'missing',
        type,
        isSupabaseInvite,
        hashParams,
        currentURL: window.location.href,
        allParams: Object.fromEntries(searchParams.entries())
      })
    }
  }, [hashParams, accessToken, refreshToken, type, isSupabaseInvite, email, supabaseInviteFlag])

  const handleSupabaseInvite = async () => {
    try {
      console.log('🔍 Handling Supabase invitation')
      
      let sessionData = null
      
      // If we have auth tokens, set the session
      if (accessToken && refreshToken) {
        console.log('🔍 Setting session from URL tokens')
        const { data: authData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (sessionError) {
          console.error('❌ Session error:', sessionError)
          setError('Invalid invitation tokens. Please request a new invitation.')
          setIsLoading(false)
          return
        }

        console.log('✅ Session set successfully:', authData)
        sessionData = authData
        setCurrentUser(authData.user)
      } else {
        // If no tokens, check if user is already authenticated
        console.log('🔍 Checking existing session')
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          console.log('✅ User already authenticated:', userData.user.email)
          sessionData = { user: userData.user }
          setCurrentUser(userData.user)
        } else {
          console.log('⚠️ No session found, user needs to authenticate first')
          setError('Please click the invitation link from your email to authenticate.')
          setIsLoading(false)
          return
        }
      }
      
      // For Supabase invites, we need to find the invitation by email
      if (sessionData.user?.email) {
        try {
          const response = await fetch('/api/staff/verify-invitation-by-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sessionData.user.email })
          })
          
          if (response.ok) {
            const result = await response.json()
            setInvitation(result.invitation)
            console.log('✅ Found invitation for user:', result.invitation)
          } else {
            console.log('⚠️ No invitation found for email, user may need to set password first')
          }
        } catch (error) {
          console.log('⚠️ Error finding invitation:', error)
        }
      }
      
      // Show password setup form for first-time users
      setShowPasswordSetup(true)
      setIsLoading(false)
      
    } catch (error) {
      console.error('❌ Supabase invitation error:', error)
      setError('Failed to process invitation. Please try again.')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Wait for hash params to be loaded on client side
    if (typeof window === 'undefined') return
    
    // Wait for hashParams to be populated before making decisions
    if (Object.keys(hashParams).length === 0 && window.location.hash) {
      // Hash params not loaded yet, wait for next render
      return
    }
    
    console.log('🔍 Staff onboarding effect running with isSupabaseInvite:', isSupabaseInvite)
    
    // Only handle Supabase invitation flow
    if (isSupabaseInvite) {
      handleSupabaseInvite()
      return
    }

    // If not a Supabase invite, show error
    console.log('❌ Not a Supabase invite, showing error')
    setError('Invalid invitation link. Please use the invitation link from your email.')
    setIsLoading(false)
  }, [isSupabaseInvite, hashParams])

  const loadInvitationAndUser = async () => {
    try {
      // Check current user first
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Verify invitation using API to bypass RLS issues
      const response = await fetch('/api/staff/verify-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to verify invitation')
        return
      }

      setInvitation(result.invitation)

      // If user is logged in and email matches, show onboarding form
      if (user && user.email === result.invitation.email) {
        setShowOnboardingForm(true)
        // Pre-populate form with available data
        setOnboardingData(prev => ({
          ...prev,
          firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
          lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        }))
      }
    } catch (err) {
      console.error('Error loading invitation:', err)
      setError('Failed to load invitation details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsProcessing(true)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(window.location.href)}`,
        },
      })
      
      if (error) {
        setError(error.message)
        setIsProcessing(false)
      }
      // If successful, user will be redirected to auth callback and then back to this page
    } catch (err) {
      setError('Failed to sign up with Google')
      setIsProcessing(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('') // Clear previous errors
    
    try {
      console.log('🔄 Attempting email login for invited user:', loginForm.email)
      
      // For invited users, we only try to sign in (no signup needed)
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })

      if (loginError) {
        console.log('❌ Sign in failed:', loginError.message)
        
        if (loginError.message.includes('Email not confirmed')) {
          setError(`Please check your email (${loginForm.email}) and click the invitation link first to set up your account.`)
        } else if (loginError.message.includes('Invalid login credentials')) {
          setError(`Invalid email or password. If you haven't set up your account yet, please check your email for the invitation link.`)
        } else {
          setError(`Sign in failed: ${loginError.message}`)
        }
        setIsProcessing(false)
        return
      }

      console.log('✅ Sign in successful:', loginData)

      // Refresh user data without full page reload
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      
      console.log('👤 Current user after auth:', user?.email)
      
      // Check if email matches invitation
      if (user && user.email === invitation.email) {
        console.log('✅ Email matches invitation, showing onboarding form')
        setShowOnboardingForm(true)
      } else if (user) {
        setError(`You're signed in as ${user.email}, but this invitation is for ${invitation.email}. Please sign out and sign in with the correct email.`)
      } else {
        setError('Authentication completed but no user found. Please try again.')
      }
    } catch (err: any) {
      console.error('🚨 Email login error:', err)
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePasswordSetup = async () => {
    if (!passwordSetupForm.password || !passwordSetupForm.confirmPassword) {
      setError('Please fill in both password fields')
      return
    }

    if (passwordSetupForm.password !== passwordSetupForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordSetupForm.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      console.log('🔐 Setting up password for user')
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordSetupForm.password
      })

      if (updateError) {
        console.error('❌ Password setup failed:', updateError)
        setError(`Failed to set password: ${updateError.message}`)
        setIsProcessing(false)
        return
      }

      console.log('✅ Password set successfully')
      
      // Move to onboarding form
      setShowPasswordSetup(false)
      setShowOnboardingForm(true)
      setIsProcessing(false)

    } catch (error) {
      console.error('❌ Password setup error:', error)
      setError('Failed to set password. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleCompleteOnboarding = async () => {
    setIsProcessing(true)
    
    try {
      // Validate required fields
      if (!onboardingData.firstName || !onboardingData.lastName || !onboardingData.employeeId) {
        setError('Please fill in all required fields (First Name, Last Name, Employee ID)')
        setIsProcessing(false)
        return
      }

      // Check if email matches
      if (currentUser.email !== invitation.email) {
        setError(`This invitation is for ${invitation.email}. Please sign in with the correct email address.`)
        setIsProcessing(false)
        return
      }

      // Use API endpoint to complete onboarding (bypasses RLS issues)
      const response = await fetch('/api/staff/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationId: invitation.id,
          firstName: onboardingData.firstName,
          lastName: onboardingData.lastName,
          employeeId: onboardingData.employeeId,
          phoneNumber: onboardingData.phoneNumber,
          emergencyContact: onboardingData.emergencyContact,
          emergencyPhone: onboardingData.emergencyPhone,
          startDate: onboardingData.startDate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to complete onboarding')
      }

      // Success! Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Accept invitation error:', err)
      setError(err.message || 'Failed to complete onboarding. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Invitation Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Order<span className="text-blue-600">Pilot</span>
          </CardTitle>
          <CardDescription>
            You're invited to join {invitation.restaurant.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900">Invitation Details</h3>
              <p className="text-blue-700 text-sm mt-1">
                <strong>Restaurant:</strong> {invitation.restaurant.name}
              </p>
              <p className="text-blue-700 text-sm">
                <strong>Role:</strong> {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
              </p>
              <p className="text-blue-700 text-sm">
                <strong>Email:</strong> {invitation.email}
              </p>
            </div>
          </div>

          {showPasswordSetup && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Up Your Password</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Welcome! Please create a secure password for your account.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handlePasswordSetup(); }} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={passwordSetupForm.password}
                    onChange={(e) => setPasswordSetupForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordSetupForm.confirmPassword}
                    onChange={(e) => setPasswordSetupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Setting up...' : 'Set Password & Continue'}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          )}

          {!currentUser && !showPasswordSetup && (
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                Please sign in to continue with the onboarding process.
              </p>
              
              {!showEmailLogin ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleGoogleSignUp}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {isProcessing ? 'Signing in...' : 'Continue with Google'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setShowEmailLogin(true)
                      // Pre-populate with invitation email
                      setLoginForm(prev => ({ ...prev, email: invitation.email }))
                    }}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Sign in with Email & Password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>First time?</strong> Check your email for the invitation link to set up your account and password first.
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      <strong>Already set up?</strong> Just enter your email and password to sign in.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="loginEmail">Email</Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="loginPassword">Password</Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password (min 6 characters)"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setShowEmailLogin(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Google Sign In
                  </Button>
                </form>
              )}
            </div>
          )}

          {currentUser && !showOnboardingForm && currentUser.email === invitation.email && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ✅ Authentication Successful
                </p>
                <p className="text-green-600 text-sm mt-1">
                  You're signed in as {currentUser.email}
                </p>
              </div>
              <p className="text-gray-600">
                Please complete your staff onboarding to join the {invitation.restaurant_name} team.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowOnboardingForm(true)}
                  className="w-full"
                  size="lg"
                >
                  Complete Staff Onboarding
                </Button>
                <Button
                  onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {currentUser && !showOnboardingForm && currentUser.email !== invitation.email && (
            <div className="text-center space-y-4">
              <p className="text-red-600">
                You're signed in as {currentUser.email}, but this invitation is for {invitation.email}.
              </p>
              <p className="text-gray-600">
                Please sign out and sign in with the correct email address.
              </p>
              <Button
                onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                variant="outline"
                className="w-full"
              >
                Sign Out & Try Again
              </Button>
            </div>
          )}

          {showOnboardingForm && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-green-800">Welcome! Let's complete your onboarding</h3>
                <p className="text-sm text-gray-600">Please fill in your details to join the team</p>
                <p className="text-xs text-gray-500">Signed in as: {currentUser?.email}</p>
                <Button
                  onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  Sign Out
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={onboardingData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={onboardingData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={onboardingData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="EMP001"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={onboardingData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={onboardingData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={onboardingData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={onboardingData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleCompleteOnboarding}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Completing Onboarding...' : 'Complete Onboarding & Join Team'}
              </Button>
            </div>
          )}

          <p className="text-xs text-gray-600 text-center">
            By completing this onboarding, you'll be able to access the {invitation.restaurant.name} dashboard 
            and help manage orders, menu items, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}