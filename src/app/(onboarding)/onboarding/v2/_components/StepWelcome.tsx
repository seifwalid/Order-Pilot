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
        <div className="w-16 h-16 bg-[#ff6b3d] rounded-2xl flex items-center justify-center shadow-lg">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-loose font-serif text-white">
            Order<span className="text-[#ff6b3d]">Pilot</span>
          </h1>
          <p className="text-white/80 text-lg font-normal">Restaurant Management</p>
        </div>
      </motion.div>

      {/* Welcome content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
        className="space-y-4"
      >

        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-loose font-serif text-white">
          Let's set up your restaurant
        </h2>
        
        <p className="text-white/80 text-lg max-w-md mx-auto">
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
          { label: 'Reduce Order Errors' },
          { label: 'Speed Up Service' },
          { label: 'Increase Revenue' },
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={getSpringConfig({
              ...springConfigs.gentle,
              stiffness: 300 - index * 20
            })}
            className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <div className="text-xs font-medium text-white/80">{feature.label}</div>
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
          className="w-full bg-[#ff6b3d] hover:bg-[#ff5a24] text-white shadow-lg shadow-[#ff6b3d]/30 transition-all duration-200 h-12 text-base font-medium rounded-xl transform hover:scale-[1.02]"
        >
          Get Started
        </Button>
        
        <Button
          onClick={onNext}
          variant="ghost"
          className="w-full text-white/70 hover:text-white text-sm transition-colors"
        >
          Skip and use defaults
        </Button>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-center space-x-6 text-sm text-white/70">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">Secure Setup</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium">2-3 Minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="font-medium">No Credit Card</span>
          </div>
        </div>
        
        <div className="text-center text-xs text-white/50 max-w-md mx-auto">
          Your data is protected with enterprise-grade security. Setup takes just 2-3 minutes and no payment information is required to get started.
        </div>
      </motion.div>
    </div>
  )
}
