"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
        :root {
          --font-sans: 'Space Grotesk', ${GeistSans.style.fontFamily};
          --font-mono: ${GeistMono.style.fontFamily};
        }
      `}</style>
      <body className="font-sans bg-background text-foreground antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </>
  )
}
