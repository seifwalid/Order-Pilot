'use client'

import { useRouter } from 'next/navigation'
import Wizard from './_components/Wizard'

export default function OnboardingV2Client() {
  const router = useRouter()

  const handleComplete = () => {
    // Navigate to dashboard with a slight delay for the completion animation
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return <Wizard onComplete={handleComplete} />
}
