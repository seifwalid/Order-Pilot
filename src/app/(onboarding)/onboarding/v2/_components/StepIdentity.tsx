'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Upload, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { canCompleteStep } from '../_state/useWizardState'
import PreviewCard from './PreviewCard'
import type { StepComponentProps } from './Wizard'

export default function StepIdentity({ 
  state, 
  actions, 
  isLoading, 
  onNext, 
  onBack 
}: StepComponentProps) {
  const [localState, setLocalState] = useState({
    name: state.restaurant.name,
    location: state.restaurant.location || '',
    logoUrl: state.restaurant.logoUrl || '',
  })

  // Sync local state with global state
  useEffect(() => {
    actions.updateRestaurant(localState)
  }, [localState, actions.updateRestaurant])

  const canProceed = canCompleteStep(state, 1)

  const handleNext = () => {
    if (canProceed) {
      onNext()
    }
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
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-apple-title1 text-white">
          Tell us about your restaurant
        </h2>
        <p className="text-apple-body text-white/80">
          This information helps us personalize your experience
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Form */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
          className="space-y-6"
        >
          {/* Restaurant Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-white">
              Restaurant Name *
            </Label>
            <Input
              id="name"
              value={localState.name}
              onChange={(e) => setLocalState(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your restaurant name"
              className="h-12 text-lg accent-focus"
              required
            />
            <p className="text-xs text-white/70">
              This will appear on orders and customer communications
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-white">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="location"
                value={localState.location}
                onChange={(e) => setLocalState(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State or Full Address"
                className="h-12 pl-11 accent-focus"
              />
            </div>
            <p className="text-xs text-white/70">
              Optional: Helps with local SEO and customer directions
            </p>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">
              Restaurant Logo
            </Label>
            <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-white/50 transition-colors">
              <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
              <p className="text-sm text-white/80 mb-2">
                Drag & drop your logo here, or click to browse
              </p>
              <Button 
                variant="outline" 
                size="sm"
                                 className="border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15 rounded-xl"
              >
                Choose File
              </Button>
              <p className="text-xs text-white/60 mt-2">
                PNG, JPG up to 2MB. Square format recommended.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
          className="lg:sticky lg:top-8"
        >
          <PreviewCard
            title="Preview"
            description="See how your restaurant will appear"
          >
            <div className="space-y-4">
              {/* Restaurant Header */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                  {localState.logoUrl ? (
                    <img 
                      src={localState.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {localState.name || 'Your Restaurant Name'}
                  </h3>
                  {localState.location && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {localState.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Sample Order Card */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-black">Order #1234</span>
                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                     Ready
                   </span>
                 </div>
                <p className="text-xs text-gray-600">
                  Customer: John D. • Phone: (555) 123-4567
                </p>
                <div className="text-xs text-gray-700">
                  2x Margherita Pizza • 1x Caesar Salad
                </div>
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
           onClick={handleNext}
           disabled={!canProceed || isLoading}
                       className={`px-8 py-3 font-medium rounded-xl transition-all duration-200 ${
              canProceed
                ? 'border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15'
                : 'bg-gray-200 text-gray-600 cursor-not-allowed'
            }`}
         >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </motion.div>

      {/* Required field indicator */}
      {!canProceed && localState.name.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-amber-400 text-center"
        >
          Restaurant name is required to continue
        </motion.p>
      )}
    </div>
  )
}
