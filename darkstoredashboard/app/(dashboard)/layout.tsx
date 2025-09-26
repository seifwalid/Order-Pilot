import type React from "react"
import { Header } from "./_components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 pt-[65px] flex">
        {children}
      </main>
    </div>
  )
}
