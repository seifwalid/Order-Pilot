'use client'

import DashboardLayout from './DashboardLayout'

interface DashboardLayoutWrapperProps {
  children: React.ReactNode
  user: any
  restaurant: any
  role: string
}

export default function DashboardLayoutWrapper({ children, user, restaurant, role }: DashboardLayoutWrapperProps) {
  return (
    <DashboardLayout user={user} restaurant={restaurant} role={role}>
      {children}
    </DashboardLayout>
  )
}
