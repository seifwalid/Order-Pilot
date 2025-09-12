'use client'

import { motion } from 'framer-motion'
import { Sparkles, Target, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import type { StepComponentProps } from './Wizard'

export default function StepWelcome({ onNext }: StepComponentProps) {
  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Hero Section */}
      <div className="text-center space-y-12">
        {/* Logo and Branding */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={getSpringConfig(springConfigs.bouncy)}
          className="space-y-6"
        >
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="/images/logo.png" 
              alt="OrderPilot Logo" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-xl"
            />
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                OrderPilot
              </h1>
              <p className="text-white/80 text-lg font-normal">Restaurant Management</p>
            </div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-loose font-serif text-white">
            Let's set up your restaurant
          </h2>
          
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            We'll personalize OrderPilot for your restaurant in just a few minutes. 
            Ready to transform your operations?
          </p>
        </motion.div>

        {/* Value Propositions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { 
              label: 'Reduce Order Errors',
              description: 'AI-powered accuracy',
              icon: Target,
              color: 'text-emerald-400',
              bgColor: 'bg-emerald-400/20'
            },
            { 
              label: 'Speed Up Service',
              description: 'Faster order processing',
              icon: Zap,
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/20'
            },
            { 
              label: 'Increase Revenue',
              description: 'Better customer experience',
              icon: TrendingUp,
              color: 'text-amber-400',
              bgColor: 'bg-amber-400/20'
            },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={getSpringConfig({
                  ...springConfigs.gentle,
                  stiffness: 300 - index * 20
                })}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200"
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{feature.label}</h3>
                <p className="text-xs text-white/70">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 220 })}
          className="space-y-4 max-w-md mx-auto"
        >
          <Button
            onClick={onNext}
            size="lg"
            className="w-full bg-[#ae8d5e] hover:bg-[#9a7a4a] text-white shadow-lg shadow-[#ae8d5e]/30 transition-all duration-200 h-14 text-lg font-semibold rounded-xl transform hover:scale-[1.02]"
          >
            Get Started
          </Button>
          
          <Button
            onClick={onNext}
            variant="ghost"
            className="w-full text-white/70 hover:text-white text-sm transition-colors py-3"
          >
            Skip and use defaults
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
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
          
          <div className="text-center text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
            Your data is protected with enterprise-grade security. Setup takes just 2-3 minutes and no payment information is required to get started.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
