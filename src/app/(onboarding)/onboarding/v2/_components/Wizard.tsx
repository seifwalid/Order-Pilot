'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWizardState, stepMetadata } from '../_state/useWizardState'
import { applyAccentColor } from '@/lib/theme/accent'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { cn } from '@/lib/utils/cn'

// Import step components
import StepWelcome from './StepWelcome'
import StepIdentity from './StepIdentity'
import StepConnections from './StepConnections'
import StepTeam from './StepTeam'
import StepMenu from './StepMenu'
import StepTheme from './StepTheme'
import StepVoice from './StepVoice'
import StepSummary from './StepSummary'

import '../_styles/gradients.css'

// Step component props interface
export interface StepComponentProps {
  state: ReturnType<typeof useWizardState>['state']
  actions: ReturnType<typeof useWizardState>['actions']
  isLoading: boolean
  error: string | null
  onNext: () => void
  onBack: () => void
  onJumpTo?: (step: number) => void
  onComplete?: () => void
}

interface WizardProps {
  onComplete?: () => void
}

const stepComponents = [
  StepWelcome,
  StepIdentity,
  StepConnections,
  StepTeam,
  StepMenu,
  StepTheme,
  StepVoice,
  StepSummary,
]

const stepGradients = [
  'gradient-welcome',
  'gradient-identity',
  'gradient-connections',
  'gradient-team',
  'gradient-menu',
  'gradient-theme',
  'gradient-voice',
  'gradient-summary',
]

export default function Wizard({ onComplete }: WizardProps) {
  const { state, actions, isLoading, error } = useWizardState()

  // Apply theme accent color when it changes
  useEffect(() => {
    if (state.theme.accent) {
      applyAccentColor(state.theme.accent)
    }
  }, [state.theme.accent])

  // Handle completion
  useEffect(() => {
    if (state.stepIndex >= stepMetadata.length - 1 && onComplete) {
      onComplete()
    }
  }, [state.stepIndex, onComplete])

  const currentStep = Math.min(state.stepIndex, stepComponents.length - 1)
  const CurrentStepComponent = stepComponents[currentStep]
  const currentGradient = stepGradients[currentStep]

  const handleNext = async () => {
    try {
      // Save current step if it has data to persist
      if (currentStep > 0 && currentStep < stepComponents.length - 1) {
        await actions.saveStep(currentStep)
      }
      actions.nextStep()
    } catch (err) {
      console.error('Failed to proceed to next step:', err)
    }
  }

  const handleBack = () => {
    actions.prevStep()
  }

  const handleJumpTo = (step: number) => {
    actions.jumpToStep(step)
  }

  const handleComplete = async () => {
    try {
      await actions.completeOnboarding()
      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      console.error('Failed to complete onboarding:', err)
    }
  }

  // Loading state
  if (!state.serverHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-apple-callout text-gray-600">Loading your restaurant setup...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen transition-all duration-1000 ease-in-out",
      currentGradient
    )}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 onboarding-gradient opacity-50" />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-screen-md">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-apple-footnote font-apple-medium text-gray-700">
                Step {currentStep + 1} of {stepMetadata.length}
              </span>
              <span className="text-apple-footnote text-gray-500">
                {stepMetadata[currentStep]?.title}
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1">
              <motion.div
                className="h-1 accent-bg rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentStep + 1) / stepMetadata.length) * 100}%` 
                }}
                transition={getSpringConfig(springConfigs.gentle)}
              />
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={getSpringConfig(springConfigs.gentle)}
              className="glass-card rounded-2xl p-8 shadow-xl"
            >
              <CurrentStepComponent
                state={state}
                actions={actions}
                isLoading={isLoading}
                error={error}
                onNext={handleNext}
                onBack={handleBack}
                onJumpTo={handleJumpTo}
                onComplete={handleComplete}
              />
            </motion.div>
          </AnimatePresence>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Skip to dashboard link (for development/testing) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 text-center">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Skip to Dashboard (Dev Only)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Accessibility announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isLoading && "Loading..."}
        {error && `Error: ${error}`}
        Step {currentStep + 1} of {stepMetadata.length}: {stepMetadata[currentStep]?.title}
      </div>
    </div>
  )
}


