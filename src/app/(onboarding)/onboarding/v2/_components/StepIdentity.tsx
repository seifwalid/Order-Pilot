'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Upload, Building2, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { canCompleteStep } from '../_state/useWizardState'
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

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

      <div className="max-w-2xl mx-auto">
        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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

          {/* Preview Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              onClick={() => setIsPreviewOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-200 group"
            >
              <Eye className="w-5 h-5 text-white group-hover:text-[#ae8d5e] transition-colors" />
              <span className="text-white font-medium">Preview Restaurant</span>
            </motion.button>
          </div>
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
                ? 'bg-[#ae8d5e] hover:bg-[#9a7a4a] text-white shadow-lg shadow-[#ae8d5e]/30 hover:shadow-[#9a7a4a]/40 transform hover:scale-[1.02]'
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

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={getSpringConfig(springConfigs.gentle)}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#ae8d5e] rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Restaurant Preview</h3>
                    <p className="text-sm text-gray-500">See how your restaurant will appear</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Restaurant Header */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                      {localState.logoUrl ? (
                        <img 
                          src={localState.logoUrl} 
                          alt="Logo" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Building2 className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {localState.name || 'Your Restaurant Name'}
                      </h3>
                      {localState.location && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {localState.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Restaurant Info Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-700">Restaurant Status</span>
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>• Orders: Ready to receive</p>
                      <p>• Menu: Configured</p>
                      <p>• Staff: Invited</p>
                    </div>
                  </div>

                  {/* Sample Order Cards */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-700">Recent Orders</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium text-black">Order #1234</span>
                          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            Ready
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: John D. • Phone: (555) 123-4567
                        </p>
                        <div className="text-sm text-gray-700">
                          2x Margherita Pizza • 1x Caesar Salad
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium text-black">Order #1235</span>
                          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            Preparing
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: Sarah M. • Phone: (555) 987-6543
                        </p>
                        <div className="text-sm text-gray-700">
                          1x Pepperoni Pizza • 2x Garlic Bread
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
