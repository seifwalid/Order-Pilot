'use client'

import { motion } from 'framer-motion'
import { ChefHat, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import type { StepComponentProps } from './Wizard'

export default function StepWelcome({ onNext }: StepComponentProps) {
  return (
    <div className="text-center space-y-8">
      {/* Logo and icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={getSpringConfig(springConfigs.bouncy)}
        className="flex items-center justify-center space-x-3"
      >
        <div className="w-16 h-16 accent-bg rounded-2xl flex items-center justify-center shadow-lg">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-apple-title1 text-gray-900">
            Order<span className="accent-text">Pilot</span>
          </h1>
          <p className="text-apple-footnote text-gray-500">Restaurant Management</p>
        </div>
      </motion.div>

      {/* Welcome content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
        className="space-y-4"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-apple-caption1 font-apple-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Restaurant Management
        </div>
        
        <h2 className="text-apple-largeTitle text-gray-900">
          Let's set up your restaurant
        </h2>
        
        <p className="text-apple-body text-gray-600 max-w-md mx-auto">
          We'll personalize OrderPilot for your restaurant in just a few minutes. 
          Ready to transform your operations?
        </p>
      </motion.div>

      {/* Features preview */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
        className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
      >
        {[
          { icon: '📱', label: 'Voice Orders' },
          { icon: '👥', label: 'Team Management' },
          { icon: '📊', label: 'Real-time Analytics' },
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={getSpringConfig({
              ...springConfigs.gentle,
              stiffness: 300 - index * 20
            })}
            className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm"
          >
            <div className="text-2xl mb-1">{feature.icon}</div>
            <div className="text-xs font-medium text-gray-700">{feature.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 220 })}
        className="space-y-3"
      >
        <Button
          onClick={onNext}
          size="lg"
          className="w-full accent-bg accent-hover text-white text-apple-button py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          Get Started
        </Button>
        
        <Button
          onClick={onNext}
          variant="ghost"
          className="w-full text-gray-600 hover:text-gray-800 text-apple-callout"
        >
          Skip and use defaults
        </Button>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex items-center justify-center space-x-6 text-apple-caption2 text-gray-500"
      >
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Secure Setup</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>2-3 Minutes</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>No Credit Card</span>
        </div>
      </motion.div>
    </div>
  )
}
