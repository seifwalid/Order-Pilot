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
        <h2 className="text-2xl font-bold text-white">
          Choose your theme
        </h2>
        <p className="text-white/80">
          Customize the look and feel of your restaurant dashboard
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
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

          {/* Accent Colors */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center">
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
                         isSelected ? 'border-white/40 scale-110' : 'border-transparent'
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
                    
                                         <div className="mt-2 text-center h-[80px] flex flex-col justify-center">
                       <p className="text-xs font-medium text-white">
                         {color.name}
                       </p>
                       <p className="text-xs text-white/70">
                         {color.description}
                       </p>
                       {!hasGoodContrast && (
                         <p className="text-xs text-amber-400 mt-1">
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
            <label className="text-sm font-medium text-white">
              Custom Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={state.theme.accent}
                onChange={(e) => handleAccentChange(e.target.value)}
                className="w-12 h-10 rounded-lg border border-white/30 cursor-pointer"
                aria-label="Choose custom color"
              />
                             <input
                 type="text"
                 value={state.theme.accent}
                 onChange={(e) => handleAccentChange(e.target.value)}
                 placeholder="#3b82f6"
                 className="flex-1 px-3 py-2 border border-white/30 rounded-lg text-sm bg-white text-black"
                 aria-label="Enter custom color hex code"
               />
            </div>
          </div>
        </div>

                 {/* Live Preview */}
         <motion.div
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
           className="flex items-center justify-center min-h-[600px] mt-16"
         >
          <PreviewCard
            title="Live Preview"
            description="See your theme in action"
          >
                         <div className="space-y-4">
               {/* Sample Dashboard Header */}
               <div className="p-4 bg-black/20 backdrop-blur-xl rounded-lg border border-white/20">
                 <div className="flex items-center justify-between mb-3">
                   <h3 className="font-semibold text-white">Dashboard</h3>
                   <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: state.theme.accent }}>
                     <div className="w-2 h-2 bg-white rounded-full" />
                   </div>
                 </div>
                 
                 {/* Sample buttons */}
                 <div className="flex space-x-2 mb-3">
                   <button className="px-3 py-1 rounded-md text-sm font-medium text-white" style={{ backgroundColor: state.theme.accent }}>
                     Primary
                   </button>
                   <button className="px-3 py-1 border border-white/30 text-white rounded-md text-sm font-medium bg-black/20">
                     Secondary
                   </button>
                 </div>
 
                 {/* Sample content */}
                 <div className="space-y-2">
                   <div className="h-2 bg-white/20 rounded w-3/4" />
                   <div className="h-2 bg-white/20 rounded w-1/2" />
                 </div>
               </div>
 
               {/* Sample Order Card */}
               <div className="p-3 bg-black/20 backdrop-blur-xl rounded-lg border border-white/20">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-sm font-medium text-white">Order #1234</span>
                   <span className="text-xs text-white px-2 py-1 rounded-full" style={{ backgroundColor: state.theme.accent }}>
                     Ready
                   </span>
                 </div>
                 <div className="text-xs text-white/70">
                   Customer: John D. • Total: $24.99
                 </div>
               </div>
 
               {/* Theme info */}
               <div className="text-center p-3 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20">
                 <p className="text-sm font-medium text-white">
                   {state.theme.mode === 'auto' ? 'Auto' : 
                    state.theme.mode === 'dark' ? 'Dark' : 'Light'} Theme
                 </p>
                 <p className="text-xs text-white/70 mt-1">
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
          className="text-white/70 hover:text-white"
        >
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 font-medium rounded-xl transition-all duration-200 border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15"
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
