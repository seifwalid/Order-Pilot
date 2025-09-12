'use client'

import { useEffect, useState } from 'react'

interface HydrationSuppressorProps {
  children: React.ReactNode
}

export function HydrationSuppressor({ children }: HydrationSuppressorProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // During SSR and initial hydration, render a minimal version
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0f1216] text-white">
        {/* Minimal loading state that matches the expected structure */}
        <div className="min-h-screen bg-[#0f1216] text-white relative">
          <div className="pointer-events-none fixed inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b3d]/15 via-[#0f1216] to-emerald-500/10" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ff6b3d]/25 via-[#ff6b3d]/10 to-transparent blur-3xl" />
            <div className="absolute -bottom-60 -left-40 h-[1400px] w-[1600px] rounded-full bg-gradient-radial from-emerald-500/20 via-emerald-500/10 to-transparent blur-3xl" />
            <div className="absolute top-1/3 -right-20 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ff6b3d]/15 via-emerald-500/10 to-transparent blur-3xl" />
            <div className="absolute top-2/3 left-1/4 h-[1100px] w-[1300px] rounded-full bg-gradient-radial from-emerald-500/15 via-[#ff6b3d]/8 to-transparent blur-3xl" />
          </div>
          
          {/* Navigation placeholder */}
          <header className="relative z-40 w-full">
            <div className="mx-auto max-w-7xl px-4 md:px-1 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-white/10 rounded-full animate-pulse" />
                  <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-12 w-64 bg-white/10 rounded-full animate-pulse" />
              </div>
            </div>
          </header>

          {/* Hero section placeholder */}
          <section className="relative overflow-visible min-h-[80vh] flex items-center z-10">
            <div className="relative z-10 w-full px-6">
              <div className="max-w-3xl mx-auto text-center">
                <div className="h-6 w-48 bg-white/10 rounded mx-auto mb-4 animate-pulse" />
                <div className="h-16 w-96 bg-white/10 rounded mx-auto mb-6 animate-pulse" />
                <div className="h-6 w-80 bg-white/10 rounded mx-auto mb-8 animate-pulse" />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="h-14 w-40 bg-white/10 rounded-full animate-pulse" />
                  <div className="h-14 w-32 bg-white/10 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard image placeholder */}
          <section className="relative -mt-48 md:-mt-56 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="h-[520px] bg-white/10 rounded-[24px] animate-pulse" />
            </div>
          </section>
        </div>
      </div>
    )
  }

  // After hydration, render the full component
  return <>{children}</>
}
