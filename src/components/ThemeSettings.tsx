'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Sun, Moon, Check, Save, Settings, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { accentColors, applyTheme } from '@/lib/theme/accent'

interface ThemeSettings {
  mode: 'default' | 'light' | 'dark' | 'auto'
  accent: string
}

const themeMode = [
  {
    id: 'default',
    name: 'Default',
    description: 'The signature OrderPilot theme',
    icon: Settings,
  },
  {
    id: 'light',
    name: 'Light',
    description: 'A clean and bright interface',
    icon: Sun,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'A sleek, dark interface',
    icon: Moon,
  },
] as const

export default function ThemeSettings() {
  const [theme, setTheme] = useState<ThemeSettings>({
    mode: 'default',
    accent: '#ae8d5e',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('orderpilot_theme')
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        const themeWithDefaults = {
          mode: parsed.mode || 'default',
          accent: parsed.accent || '#ae8d5e',
        }
        // Set the initial state without re-applying the theme here
        setTheme(themeWithDefaults)
      } catch (error) {
        console.error('Failed to parse saved theme:', error)
      }
    }
  }, [])

  // Apply theme changes immediately when the user interacts with the controls
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const handleModeChange = (mode: 'default' | 'light' | 'dark' | 'auto') => {
    setTheme(prev => ({ ...prev, mode }))
    setIsSaved(false)
  }

  const handleAccentChange = (accent: string) => {
    setTheme(prev => ({ ...prev, accent }))
    setIsSaved(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    localStorage.setItem('orderpilot_theme', JSON.stringify(theme))
    // Simulate a save operation
    await new Promise(resolve => setTimeout(resolve, 750))
    setIsLoading(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={getSpringConfig(springConfigs.gentle)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Theme Controls */}
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Mode</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themeMode.map(mode => (
              <motion.button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  theme.mode === mode.id
                    ? 'border-accent bg-accent/10 backdrop-blur-xl'
                    : 'border-border bg-muted/50 backdrop-blur-xl hover:border-border/80 hover:bg-muted'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <mode.icon className="w-6 h-6 mb-2 text-accent" />
                <h4 className="font-semibold text-foreground">{mode.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {theme.mode !== 'default' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Accent Color Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Accent Color</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {accentColors.map(color => (
                    <motion.button
                      key={color.name}
                      onClick={() => handleAccentChange(color.value)}
                      className="w-full h-12 rounded-lg border-2 transition-all duration-200"
                      style={{ backgroundColor: color.value, borderColor: theme.accent === color.value ? 'var(--accent)' : 'transparent' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Select ${color.name} color`}
                    >
                      {theme.accent === color.value && <Check className="w-5 h-5 text-white m-auto" />}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Custom Primary Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                    aria-label="Choose custom color"
                  />
                  <input
                    type="text"
                    value={theme.accent}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    placeholder="#ae8d5e"
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
                    aria-label="Enter custom color hex code"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {theme.mode === 'default' && (
          <div className="p-4 bg-muted/80 border border-border rounded-xl flex items-center space-x-3">
            <Info className="w-5 h-5 text-accent flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              The Default theme uses the signature OrderPilot color palette and is not customizable.
            </p>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isLoading || isSaved}
          className="w-full sm:w-auto min-w-[120px] bg-accent hover:bg-accent-hover text-accent-foreground"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isSaved ? (
            <Check className="w-5 h-5" />
          ) : (
            <div className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              <span>Save Changes</span>
            </div>
          )}
        </Button>
      </div>

      {/* Live Preview */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-foreground">Live Preview</h3>
        <div className="p-4 bg-background rounded-2xl border border-border shadow-lg">
          {/* Preview Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Logo" className="w-6 h-6" />
              <span className="font-bold text-foreground">OrderPilot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full" />
              <div className="w-6 h-6 bg-muted rounded-full" />
            </div>
          </div>

          {/* Preview Content */}
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card border border-border rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-1">Total Revenue</h4>
                <p className="text-xl font-bold text-accent">$1,234.56</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-1">New Orders</h4>
                <p className="text-xl font-bold text-accent">58</p>
              </div>
            </div>
            <div className="p-3 bg-muted/80 backdrop-blur-xl rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Order #1234</span>
                <span 
                  className="text-xs text-white px-2 py-1 rounded-full bg-secondary-accent"
                >
                  Ready
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                2x Classic Burger, 1x Fries
              </div>
            </div>
            <Button className="w-full bg-accent hover:bg-accent-hover text-accent-foreground">
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
