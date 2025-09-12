'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { onboardingAPI, type OnboardingState, defaultOnboardingState } from '@/lib/onboarding/api'

interface WizardActions {
  nextStep: () => void
  prevStep: () => void
  jumpToStep: (step: number) => void
  updateRestaurant: (data: Partial<OnboardingState['restaurant']>) => void
  updateIntegrations: (data: Partial<OnboardingState['integrations']>) => void
  updateTeam: (data: Partial<OnboardingState['team']>) => void
  updateMenu: (data: Partial<OnboardingState['menu']>) => void
  updateTheme: (data: Partial<OnboardingState['theme']>) => void
  updateVoice: (data: Partial<OnboardingState['voice']>) => void
  saveStep: (stepIndex: number) => Promise<void>
  completeOnboarding: () => Promise<void>
  reset: () => void
}

interface WizardStateHook {
  state: OnboardingState
  actions: WizardActions
  isLoading: boolean
  error: string | null
}

const STORAGE_KEY = 'orderpilot_onboarding_state'
const TOTAL_STEPS = 8

/**
 * Wizard state management with server synchronization
 * Maintains local cache with localStorage backup for resilience
 */
export function useWizardState(): WizardStateHook {
  const [state, setState] = useState<OnboardingState>(defaultOnboardingState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isInitialLoadRef = useRef(true)
  const shouldPersistRef = useRef(false)

  // Load initial state from server and localStorage
  useEffect(() => {
    const loadInitialState = async () => {
      setIsLoading(true)
      setError(null)
      isInitialLoadRef.current = true
      shouldPersistRef.current = false

      try {
        // Try to load from localStorage first for immediate UI
        const cached = localStorage.getItem(STORAGE_KEY)
        if (cached) {
          const cachedState = JSON.parse(cached) as OnboardingState
          setState(cachedState)
        }

        // Then sync with server
        const serverState = await onboardingAPI.getState()
        const finalState = {
          ...serverState,
          serverHydrated: true
        }
        
        setState(finalState)
        
        // Update localStorage with server state (direct call, not through useEffect)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalState))
      } catch (err) {
        console.error('Failed to load onboarding state:', err)
        setError(err instanceof Error ? err.message : 'Failed to load state')
        
        // Fall back to cached state if available
        const cached = localStorage.getItem(STORAGE_KEY)
        if (cached) {
          setState(JSON.parse(cached))
        }
      } finally {
        setIsLoading(false)
        isInitialLoadRef.current = false
        shouldPersistRef.current = true // Enable persistence after initial load
      }
    }

    loadInitialState()
  }, [])

  // Persist to localStorage whenever state changes (but not during initial load)
  useEffect(() => {
    if (shouldPersistRef.current && state.serverHydrated && !isLoading && !isInitialLoadRef.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isLoading])

  const updateState = useCallback((updater: (prev: OnboardingState) => OnboardingState) => {
    shouldPersistRef.current = true // Enable persistence for user actions
    setState(updater)
  }, [])

  const nextStep = useCallback(() => {
    updateState(prev => ({
      ...prev,
      stepIndex: Math.min(prev.stepIndex + 1, TOTAL_STEPS - 1)
    }))
  }, [updateState])

  const prevStep = useCallback(() => {
    updateState(prev => ({
      ...prev,
      stepIndex: Math.max(prev.stepIndex - 1, 0)
    }))
  }, [updateState])

  const jumpToStep = useCallback((step: number) => {
    updateState(prev => ({
      ...prev,
      stepIndex: Math.max(0, Math.min(step, TOTAL_STEPS - 1))
    }))
  }, [updateState])

  const updateRestaurant = useCallback((data: Partial<OnboardingState['restaurant']>) => {
    updateState(prev => ({
      ...prev,
      restaurant: { ...prev.restaurant, ...data }
    }))
  }, [updateState])

  const updateIntegrations = useCallback((data: Partial<OnboardingState['integrations']>) => {
    updateState(prev => ({
      ...prev,
      integrations: { ...prev.integrations, ...data }
    }))
  }, [updateState])

  const updateTeam = useCallback((data: Partial<OnboardingState['team']>) => {
    updateState(prev => ({
      ...prev,
      team: { ...prev.team, ...data }
    }))
  }, [updateState])

  const updateMenu = useCallback((data: Partial<OnboardingState['menu']>) => {
    updateState(prev => ({
      ...prev,
      menu: { ...prev.menu, ...data }
    }))
  }, [updateState])

  const updateTheme = useCallback((data: Partial<OnboardingState['theme']>) => {
    updateState(prev => ({
      ...prev,
      theme: { ...prev.theme, ...data }
    }))
  }, [updateState])

  const updateVoice = useCallback((data: Partial<OnboardingState['voice']>) => {
    updateState(prev => ({
      ...prev,
      voice: { ...prev.voice, ...data }
    }))
  }, [updateState])

  const saveStep = useCallback(async (stepIndex: number) => {
    setIsLoading(true)
    setError(null)

    try {
      switch (stepIndex) {
        case 1: // Identity
          await onboardingAPI.updateIdentity(state.restaurant)
          break
        case 2: // Integrations
          await onboardingAPI.updateIntegrations(state.integrations)
          break
        case 3: // Team
          await onboardingAPI.inviteTeam({ emails: state.team.invites })
          break
        case 4: // Menu
          await onboardingAPI.updateMenu(state.menu)
          break
        case 5: // Theme
          await onboardingAPI.updateTheme(state.theme)
          break
        case 6: // Voice
          await onboardingAPI.updateVoice(state.voice)
          break
      }

      // Update localStorage after successful save
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
      console.error('Failed to save step:', err)
      setError(err instanceof Error ? err.message : 'Failed to save step')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [state])

  const completeOnboarding = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await onboardingAPI.complete({ acknowledged: true })
      
      // Clear localStorage after successful completion
      localStorage.removeItem(STORAGE_KEY)
      
      // Update state to reflect completion
      updateState(prev => ({
        ...prev,
        stepIndex: TOTAL_STEPS - 1
      }))
    } catch (err) {
      console.error('Failed to complete onboarding:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [updateState])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultOnboardingState)
  }, [])

  const actions: WizardActions = {
    nextStep,
    prevStep,
    jumpToStep,
    updateRestaurant,
    updateIntegrations,
    updateTeam,
    updateMenu,
    updateTheme,
    updateVoice,
    saveStep,
    completeOnboarding,
    reset,
  }

  return {
    state,
    actions,
    isLoading,
    error,
  }
}

// Step metadata for navigation and validation
export const stepMetadata = [
  { id: 'welcome', title: 'Welcome', required: false },
  { id: 'identity', title: 'Restaurant Identity', required: true },
  { id: 'connections', title: 'Connections', required: false },
  { id: 'team', title: 'Team', required: false },
  { id: 'menu', title: 'Menu', required: false },
  { id: 'voice', title: 'Voice', required: false },
  { id: 'theme', title: 'Appearance', required: false },
  { id: 'summary', title: 'Summary', required: false },
]

/**
 * Validate if a step can be completed
 */
export function canCompleteStep(state: OnboardingState, stepIndex: number): boolean {
  switch (stepIndex) {
    case 1: // Identity
      return state.restaurant.name.trim().length > 0
    case 2: // Connections
      return true // Optional step
    case 3: // Team
      return true // Optional step
    case 4: // Menu
      return true // Optional step
    case 5: // Voice
      return true // Optional step
    case 6: // Theme (Appearance)
      return true // Optional step
    default:
      return true
  }
}
