'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { accentColors, applyAccentColor, isAccessibleContrast } from '@/lib/theme/accent'
import PreviewCard from './PreviewCard'
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
  // Apply theme changes immediately for live preview
  useEffect(() => {
    applyAccentColor(state.theme.accent)
  }, [state.theme.accent])

  const handleModeChange = (mode: 'light' | 'dark' | 'auto') => {
    actions.updateTheme({ mode })
  }

  const handleAccentChange = (accent: string) => {
    actions.updateTheme({ accent })
    applyAccentColor(accent)
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
        <div className="w-12 h-12 accent-bg rounded-xl flex items-center justify-center mx-auto mb-4">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Choose your theme
        </h2>
        <p className="text-gray-600">
          Customize the look and feel of your restaurant dashboard
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Theme Controls */}
        <div className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
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
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <h4 className="font-medium text-gray-900 text-sm">
                      {mode.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {mode.description}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Accent Color
            </h3>
            
            <div className="grid grid-cols-4 gap-3">
              {accentColors.map((color) => {
                const isSelected = state.theme.accent === color.value
                const hasGoodContrast = isAccessibleContrast(color.value, color.foreground)
                
                return (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAccentChange(color.value)}
                    className="group relative"
                  >
                    <div
                      className={`w-full aspect-square rounded-xl border-4 transition-all duration-200 ${
                        isSelected ? 'border-gray-400 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={getSpringConfig(springConfigs.bouncy)}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check 
                            className="w-5 h-5"
                            style={{ color: color.foreground }}
                          />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-gray-900">
                        {color.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {color.description}
                      </p>
                      {!hasGoodContrast && (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠️ Low contrast
                        </p>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Custom Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={state.theme.accent}
                onChange={(e) => handleAccentChange(e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={state.theme.accent}
                onChange={(e) => handleAccentChange(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm accent-focus"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
          className="lg:sticky lg:top-8"
        >
          <PreviewCard
            title="Live Preview"
            description="See your theme in action"
          >
            <div className="space-y-4">
              {/* Sample Dashboard Header */}
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Dashboard</h3>
                  <div className="w-8 h-8 accent-bg rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                
                {/* Sample buttons */}
                <div className="flex space-x-2 mb-3">
                  <button className="px-3 py-1 accent-bg text-white rounded-md text-sm font-medium">
                    Primary
                  </button>
                  <button className="px-3 py-1 border accent-border accent-text rounded-md text-sm font-medium">
                    Secondary
                  </button>
                </div>

                {/* Sample content */}
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>

              {/* Sample Order Card */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Order #1234</span>
                  <span className="text-xs accent-bg text-white px-2 py-1 rounded-full">
                    Ready
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Customer: John D. • Total: $24.99
                </div>
              </div>

              {/* Theme info */}
              <div className="text-center p-3 accent-muted rounded-lg">
                <p className="text-sm accent-text font-medium">
                  {state.theme.mode === 'auto' ? 'Auto' : 
                   state.theme.mode === 'dark' ? 'Dark' : 'Light'} Theme
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Accent: {accentColors.find(c => c.value === state.theme.accent)?.name || 'Custom'}
                </p>
              </div>
            </div>
          </PreviewCard>
        </motion.div>
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
          className="text-gray-600 hover:text-gray-800"
        >
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 font-semibold rounded-xl accent-bg accent-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
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
