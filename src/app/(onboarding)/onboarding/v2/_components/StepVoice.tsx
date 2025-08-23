'use client'

import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import Waveform from './Waveform'
import type { StepComponentProps } from './Wizard'

export default function StepVoice({ 
  state, 
  actions, 
  isLoading, 
  onNext, 
  onBack 
}: StepComponentProps) {
  const isVoiceEnabled = state.voice.enabled

  const handleToggleVoice = () => {
    actions.updateVoice({ enabled: !isVoiceEnabled })
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig(springConfigs.gentle)}
        className="text-center space-y-2"
      >
        <div className="w-12 h-12 accent-bg rounded-xl flex items-center justify-center mx-auto mb-4">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-apple-title1 text-gray-900">
          Enable voice ordering
        </h2>
        <p className="text-apple-body text-gray-600">
          Let customers place orders by phone with AI assistance
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
        className="text-center space-y-6"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mx-auto"
        >
          <button
            onClick={handleToggleVoice}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isVoiceEnabled
                ? 'accent-bg shadow-2xl shadow-blue-500/25'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isVoiceEnabled ? (
              <Mic className="w-12 h-12 text-white" />
            ) : (
              <MicOff className="w-12 h-12 text-gray-500" />
            )}
          </button>

          {isVoiceEnabled && (
            <motion.div
              className="absolute inset-0 rounded-full accent-bg opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        <div className="space-y-2">
          <h3 className={`text-apple-title3 ${
            isVoiceEnabled ? 'accent-text' : 'text-gray-500'
          }`}>
            {isVoiceEnabled ? 'Voice Ordering Enabled' : 'Voice Ordering Disabled'}
          </h3>
          <p className="text-apple-callout text-gray-600">
            {isVoiceEnabled 
              ? 'Customers can now call and place orders with AI assistance'
              : 'Click the microphone to enable voice ordering'
            }
          </p>
        </div>

        {isVoiceEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
            className="max-w-md mx-auto space-y-4"
          >
            <div className="flex justify-center">
              <Waveform isActive={isVoiceEnabled} className="accent-text" />
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 accent-bg rounded-full flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-800">
                    "Welcome to {state.restaurant.name || 'your restaurant'}, how can I help you today?"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-800">
                    "Hi, I'd like to order a large pizza for pickup."
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 accent-bg rounded-full flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-800">
                    "Great! What toppings would you like on your pizza?"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {[
            {
              icon: Zap,
              title: 'Instant Setup',
              description: 'Ready to take calls immediately',
            },
            {
              icon: Volume2,
              title: 'Natural Speech',
              description: 'AI understands customer requests',
            },
            {
              icon: Mic,
              title: '24/7 Available',
              description: 'Never miss an order again',
            },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={getSpringConfig({
                  ...springConfigs.gentle,
                  stiffness: 280 - index * 20
                })}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm"
              >
                <Icon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        <Button
          onClick={handleToggleVoice}
          size="lg"
          variant={isVoiceEnabled ? "outline" : "default"}
          className={`px-8 py-3 text-apple-button rounded-xl transition-all duration-200 ${
            isVoiceEnabled
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'accent-bg accent-hover text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
          }`}
        >
          {isVoiceEnabled ? 'Disable Voice Ordering' : 'Enable Voice Ordering'}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center p-4 bg-amber-50 rounded-xl"
      >
        <p className="text-sm text-amber-800">
          🎤 Voice ordering is powered by advanced AI and can be configured later in your dashboard
        </p>
      </motion.div>

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
          className="px-8 py-3 text-apple-button rounded-xl accent-bg accent-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Configuring Voice...</span>
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </motion.div>
    </div>
  )
}