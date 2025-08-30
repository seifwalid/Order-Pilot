'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const errorMsg = searchParams.get('error')

  const supabase = createClient()

  useEffect(() => {
    setIsHydrated(true)
  }, [])



  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      })
      
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Redirect will be handled by middleware
        window.location.href = redirectTo
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1216] text-white relative">
      {/* Background Gradient with Animated Balls */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b3d]/15 via-[#0f1216] to-emerald-500/10" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ff6b3d]/25 via-[#ff6b3d]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-[1400px] w-[1600px] rounded-full bg-gradient-radial from-emerald-500/20 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ff6b3d]/15 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute top-2/3 left-1/4 h-[1100px] w-[1300px] rounded-full bg-gradient-radial from-emerald-500/15 via-[#ff6b3d]/8 to-transparent blur-3xl" />
        

      </div>

      {/* Header */}
      <header className="relative z-40 w-full pt-6">
        <div className="mx-auto max-w-7xl px-4 md:px-1">
          <div className="flex items-center justify-center">
            <a href="/" className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="OrderPilot Logo" 
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
              />
              <span className="font-bold tracking-tight text-white text-xl md:text-2xl">OrderPilot</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                     <CardHeader className="text-center space-y-2">
             
             <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight tracking-loose font-serif text-white">
               Welcome Back
             </CardTitle>
             <CardDescription className="text-white/80 text-base font-normal">
               Sign in to your restaurant dashboard
             </CardDescription>
           </CardHeader>
          
          <CardContent className="space-y-6">
            {(error || errorMsg) && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg backdrop-blur">
                {error || errorMsg}
              </div>
            )}

                         <Button
               onClick={handleGoogleSignIn}
               disabled={isLoading}
               className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur transition-all duration-200 h-12 rounded-xl hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
               variant="outline"
             >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Redirecting to Google...
                </>
              ) : (
                <>
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
                  Continue with Google
                </>
              )}
            </Button>

                         <div className="relative py-4">
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex items-center w-full">
                   <div className="flex-1 border-t border-white/20"></div>
                   <div className="px-4 text-white/70 font-medium text-xs uppercase">
                     Or continue with email
                   </div>
                   <div className="flex-1 border-t border-white/20"></div>
                 </div>
               </div>
             </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="!bg-white/5 !border-white/20 !text-white !placeholder:text-white/50 backdrop-blur h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="!bg-white/5 !border-white/20 !text-white !placeholder:text-white/50 backdrop-blur h-12"
                />
              </div>
                             <Button 
                 type="submit" 
                 className="w-full bg-[#ff6b3d] hover:bg-[#ff5a24] text-white shadow-lg shadow-[#ff6b3d]/30 transition-all duration-200 h-12 text-base font-medium rounded-xl" 
                 disabled={isLoading}
               >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-white/70">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-[#ff6b3d] hover:text-[#ff5a24] transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
