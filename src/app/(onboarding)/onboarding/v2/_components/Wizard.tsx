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
  StepVoice,
  StepTheme,
  StepSummary,
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
      <div className="min-h-screen flex items-center justify-center bg-[#0f1216] text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading your restaurant setup...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1216] text-white relative">
      {/* Background gradients - matching home page aesthetic */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ae8d5e]/15 via-[#0f1216] to-emerald-500/10" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ae8d5e]/25 via-[#ae8d5e]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-[1400px] w-[1600px] rounded-full bg-gradient-radial from-emerald-500/20 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[1200px] w-[1400px] rounded-full bg-gradient-radial from-[#ae8d5e]/15 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute top-2/3 left-1/4 h-[1100px] w-[1300px] rounded-full bg-gradient-radial from-emerald-500/15 via-[#ae8d5e]/8 to-transparent blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-40 w-full pt-6">
        <div className="mx-auto max-w-7xl px-4 md:px-1">
          <motion.div 
            className="flex items-center"
            animate={{
              justifyContent: currentStep === 0 ? 'center' : 'space-between'
            }}
            transition={getSpringConfig(springConfigs.gentle)}
          >
            <AnimatePresence>
              {currentStep > 0 && (
                <motion.a 
                  href="/" 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={getSpringConfig(springConfigs.gentle)}
                >
                  <img 
                    src="/images/logo.png" 
                    alt="OrderPilot Logo" 
                    className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg"
                  />
                  <span className="font-bold tracking-tight text-white text-xl md:text-2xl">OrderPilot</span>
                </motion.a>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {currentStep > 0 && (
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={getSpringConfig(springConfigs.gentle)}
                >
                  <div className="text-sm text-white/70 font-medium">
                    Step {currentStep + 1} of {stepMetadata.length}
                  </div>
                  <div className="text-xs text-white/50">
                    {stepMetadata[currentStep]?.title}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-screen-md">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm font-medium">
                Step {currentStep + 1} of {stepMetadata.length}
              </span>
              <span className="text-white/50 text-sm">
                {stepMetadata[currentStep]?.title}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <motion.div
                className="h-1 bg-[#ae8d5e] rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentStep + 1) / stepMetadata.length) * 100}%` 
                }}
                transition={getSpringConfig(springConfigs.gentle)}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={getSpringConfig(springConfigs.gentle)}
                className="h-full"
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
          </div>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg backdrop-blur text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Skip to dashboard link (for development/testing) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 text-center">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-sm text-white/50 hover:text-white/70 underline transition-colors"
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


