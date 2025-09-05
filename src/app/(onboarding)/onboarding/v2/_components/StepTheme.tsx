'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { applyAccentColor } from '@/lib/theme/accent'
import { canCompleteStep } from '../_state/useWizardState'
import type { StepComponentProps } from './Wizard'

const themeMode = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface',
    icon: Sun,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes',
    icon: Moon,
  },
  {
    id: 'auto',
    name: 'Auto',
    description: 'Matches system preference',
    icon: Monitor,
  },
] as const

export default function StepTheme({ 
  state, 
  actions, 
  isLoading, 
  onNext, 
  onBack 
}: StepComponentProps) {
  const canProceed = canCompleteStep(state, 6)
  // Apply theme changes immediately for live preview
  useEffect(() => {
    applyAccentColor(state.theme.accent)
  }, [state.theme.accent])

  const handleModeChange = (mode: 'light' | 'dark' | 'auto') => {
    actions.updateTheme({ mode })
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig(springConfigs.gentle)}
        className="text-center space-y-2"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/30">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Choose your appearance
        </h2>
        <p className="text-white/80">
          Select light or dark mode for your dashboard
        </p>
      </motion.div>

      <div className="max-w-md mx-auto">
        {/* Theme Controls */}
        <div className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center">
              <Sun className="w-4 h-4 mr-2" />
              Appearance
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {themeMode.map((mode) => {
                const Icon = mode.icon
                const isSelected = state.theme.mode === mode.id
                
                return (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeChange(mode.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-white/40 bg-white/10 backdrop-blur-xl'
                        : 'border-white/20 bg-black/20 backdrop-blur-xl hover:border-white/30 hover:bg-black/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${
                      isSelected ? 'text-white' : 'text-white/80'
                    }`} />
                    <h4 className="font-medium text-white text-sm">
                      {mode.name}
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      {mode.description}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Note about customization */}
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
            <h3 className="font-semibold text-white flex items-center mb-2">
              <Palette className="w-4 h-4 mr-2" />
              More Customization
            </h3>
            <p className="text-sm text-white/80">
              🎨 Color themes and accent colors can be customized in Settings after setup is complete.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 200 })}
        className="flex items-center justify-between pt-6 border-t"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white/70 hover:text-white"
        >
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className={`px-8 py-3 font-medium rounded-xl transition-all duration-200 ${
            canProceed
              ? 'bg-[#ae8d5e] hover:bg-[#9a7a4a] text-white shadow-lg shadow-[#ae8d5e]/30 hover:shadow-[#9a7a4a]/40 transform hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Theme...</span>
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </motion.div>
    </div>
  )
}
