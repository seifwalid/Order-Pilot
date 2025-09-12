import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingV2Client from './client'

export default async function OnboardingV2Page() {
  // Authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user already has completed onboarding
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('onboarding_completed')
    .eq('owner_id', user.id)
    .single()

  if (restaurant?.onboarding_completed) {
    redirect('/dashboard')
  }

  return <OnboardingV2Client />
}

// Metadata for the page
export const metadata = {
  title: 'Setup Your Restaurant - OrderPilot',
  description: 'Complete your restaurant setup with our guided onboarding experience',
}
