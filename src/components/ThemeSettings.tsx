'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Sun, Moon, Monitor, Check, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { accentColors, applyAccentColor, isAccessibleContrast } from '@/lib/theme/accent'

interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto'
  accent: string
}

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

export default function ThemeSettings() {
  const [theme, setTheme] = useState<ThemeSettings>({
    mode: 'light',
    accent: '#ff6b3d'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('orderpilot_theme')
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        setTheme(parsed)
        applyAccentColor(parsed.accent)
      } catch (error) {
        console.error('Failed to parse saved theme:', error)
      }
    }
  }, [])

  // Apply theme changes immediately
  useEffect(() => {
    applyAccentColor(theme.accent)
  }, [theme.accent])

  const handleModeChange = (mode: 'light' | 'dark' | 'auto') => {
    setTheme(prev => ({ ...prev, mode }))
    setIsSaved(false)
  }

  const handleAccentChange = (accent: string) => {
    setTheme(prev => ({ ...prev, accent }))
    applyAccentColor(accent)
    setIsSaved(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Save to localStorage
      localStorage.setItem('orderpilot_theme', JSON.stringify(theme))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Theme Controls */}
        <div className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white flex items-center">
              <Sun className="w-4 h-4 mr-2" />
              Appearance Mode
            </h4>
            
            <div className="grid grid-cols-3 gap-3">
              {themeMode.map((mode) => {
                const Icon = mode.icon
                const isSelected = theme.mode === mode.id
                
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
                    <h5 className="font-medium text-white text-sm">
                      {mode.name}
                    </h5>
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
            <h4 className="font-semibold text-white flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Accent Color
            </h4>
            
            <div className="grid grid-cols-4 gap-3">
              {accentColors.map((color) => {
                const isSelected = theme.accent === color.value
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
                value={theme.accent}
                onChange={(e) => handleAccentChange(e.target.value)}
                className="w-12 h-10 rounded-lg border border-white/30 cursor-pointer"
                aria-label="Choose custom color"
              />
              <input
                type="text"
                value={theme.accent}
                onChange={(e) => handleAccentChange(e.target.value)}
                placeholder="#ff6b3d"
                className="flex-1 px-3 py-2 border border-white/30 rounded-lg text-sm bg-white text-black"
                aria-label="Enter custom color hex code"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full px-6 py-3 font-medium rounded-xl transition-all duration-200 ${
              isSaved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-[#ff6b3d] hover:bg-[#ff5a24] text-white shadow-lg shadow-[#ff6b3d]/30 hover:shadow-[#ff5a24]/40'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Theme...</span>
              </div>
            ) : isSaved ? (
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Theme Saved!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Theme</span>
              </div>
            )}
          </Button>
        </div>

        {/* Live Preview */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
          className="space-y-4"
        >
          <h4 className="font-semibold text-white mb-4">Live Preview</h4>
          
          {/* Sample Dashboard Header */}
          <div className="p-4 bg-black/20 backdrop-blur-xl rounded-lg border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-white">Dashboard</h5>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.accent }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            
            {/* Sample buttons */}
            <div className="flex space-x-2 mb-3">
              <button 
                className="px-3 py-1 rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: theme.accent }}
              >
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
              <span 
                className="text-xs text-white px-2 py-1 rounded-full"
                style={{ backgroundColor: theme.accent }}
              >
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
              {theme.mode === 'auto' ? 'Auto' : 
               theme.mode === 'dark' ? 'Dark' : 'Light'} Theme
            </p>
            <p className="text-xs text-white/70 mt-1">
              Accent: {accentColors.find(c => c.value === theme.accent)?.name || 'Custom'}
            </p>
          </div>

          {/* Note */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300">
              💡 Changes are applied immediately. Click "Save Theme" to persist your preferences.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
