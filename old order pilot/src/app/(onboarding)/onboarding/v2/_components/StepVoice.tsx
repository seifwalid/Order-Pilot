'use client'

import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { canCompleteStep } from '../_state/useWizardState'
import Waveform from './Waveform'
import type { StepComponentProps } from './Wizard'

export default function StepVoice({ 
  state, 
  actions, 
  isLoading, 
  onNext, 
  onBack 
}: StepComponentProps) {
  const canProceed = canCompleteStep(state, 6)
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
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-[#ae8d5e] to-[#9a7a4a] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#ae8d5e]/30">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Enable voice ordering
        </h2>
        <p className="text-white/80">
          Let customers place orders by phone with AI assistance
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="relative">
            <motion.button
              onClick={handleToggleVoice}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-200 ${
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
            </motion.button>

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
          </div>
        </div>

        <div className="space-y-2">
          <h3 className={`text-apple-title3 ${
            isVoiceEnabled ? 'text-white' : 'text-white/60'
          }`}>
            {isVoiceEnabled ? 'Voice Ordering Enabled' : 'Voice Ordering Disabled'}
          </h3>
          <p className="text-apple-callout text-white/80">
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
                <div className="bg-white/10 backdrop-blur-xl rounded-lg p-3 flex-1 border border-white/20">
                  <p className="text-sm text-white">
                    "Welcome to {state.restaurant.name || 'your restaurant'}, how can I help you today?"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-lg p-3 flex-1 border border-white/20">
                  <p className="text-sm text-white">
                    "Hi, I'd like to order a large pizza for pickup."
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 accent-bg rounded-full flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-lg p-3 flex-1 border border-white/20">
                  <p className="text-sm text-white">
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
              iconColor: 'text-yellow-300',
              cardColor: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-400/20',
            },
            {
              icon: Volume2,
              title: 'Natural Speech',
              description: 'AI understands customer requests',
              iconColor: 'text-blue-300',
              cardColor: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-400/20',
            },
            {
              icon: Mic,
              title: '24/7 Available',
              description: 'Never miss an order again',
              iconColor: 'text-emerald-300',
              cardColor: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-400/20',
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
                className={`text-center p-4 rounded-xl backdrop-blur-xl border ${feature.cardColor}`}
              >
                <Icon className={`w-8 h-8 ${feature.iconColor} mx-auto mb-2`} />
                <h4 className="font-medium text-white text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-white/80">
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
              ? 'border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15'
              : 'border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15'
          }`}
        >
          {isVoiceEnabled ? 'Disable Voice Ordering' : 'Enable Voice Ordering'}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
      >
        <p className="text-sm text-white">
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
          className="text-white/70 hover:text-white"
        >
          Back
        </Button>

        <Button
          onClick={onNext}
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