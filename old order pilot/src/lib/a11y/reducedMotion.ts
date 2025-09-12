/**
 * Accessibility utilities for respecting user motion preferences
 */

import { useState, useEffect } from 'react'

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get appropriate animation duration based on user preferences
 */
export function getAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration
}

/**
 * Spring configuration that respects reduced motion
 */
export function getSpringConfig(config: { stiffness: number; damping: number }) {
  if (prefersReducedMotion()) {
    return { duration: 0.01 }
  }
  
  return {
    type: 'spring' as const,
    stiffness: config.stiffness,
    damping: config.damping,
  }
}

/**
 * Default spring configurations
 */
export const springConfigs = {
  gentle: { stiffness: 280, damping: 24 },
  bouncy: { stiffness: 400, damping: 20 },
  stiff: { stiffness: 500, damping: 30 },
}

/**
 * Hook to listen for changes in motion preferences
 */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion())
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = () => {
      setReducedMotion(mediaQuery.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])
  
  return reducedMotion
}
