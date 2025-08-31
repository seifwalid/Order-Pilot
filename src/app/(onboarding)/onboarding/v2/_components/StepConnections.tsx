'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, CreditCard, Monitor, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import type { StepComponentProps } from './Wizard'

interface ConnectionCard {
  id: keyof StepComponentProps['state']['integrations']
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: boolean
  optional: boolean
}

export default function StepConnections({ 
  state, 
  actions, 
  isLoading, 
  onNext, 
  onBack 
}: StepComponentProps) {
  const [connectingId, setConnectingId] = useState<string | null>(null)

  const connections: ConnectionCard[] = [
    {
      id: 'phone',
      title: 'Phone System',
      description: 'Connect your restaurant phone for voice orders',
      icon: Phone,
      status: state.integrations.phone,
      optional: true,
    },
    {
      id: 'pos',
      title: 'POS System',
      description: 'Sync with your existing point-of-sale system',
      icon: Monitor,
      status: state.integrations.pos,
      optional: true,
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      description: 'Set up payment processing for online orders',
      icon: CreditCard,
      status: state.integrations.payments,
      optional: true,
    },
  ]

  const handleConnect = async (connectionId: string) => {
    setConnectingId(connectionId)
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Update the integration status
    actions.updateIntegrations({
      [connectionId]: !state.integrations[connectionId as keyof typeof state.integrations]
    })
    
    setConnectingId(null)
  }

  const connectedCount = Object.values(state.integrations).filter(Boolean).length

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
          <Phone className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Connect your systems
        </h2>
        <p className="text-white/80">
          Link your existing tools to streamline operations
        </p>
      </motion.div>

      {/* Connection Status */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
        className="text-center p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
      >
        <p className="text-sm text-white">
          <span className="font-semibold">{connectedCount}</span> of {connections.length} systems connected
        </p>
        <div className="flex justify-center mt-2 space-x-1">
          {connections.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < connectedCount ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Connection Cards */}
      <div className="space-y-4">
        {connections.map((connection, index) => {
          const Icon = connection.icon
          const isConnecting = connectingId === connection.id
          const isConnected = connection.status

          return (
            <motion.div
              key={connection.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={getSpringConfig({
                ...springConfigs.gentle,
                stiffness: 280 - index * 20
              })}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                isConnected
                  ? 'border-white/40 bg-white/10 backdrop-blur-xl'
                  : 'border-white/20 bg-black/20 backdrop-blur-xl hover:border-white/30 hover:bg-black/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isConnected ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isConnected ? 'text-white' : 'text-white/80'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center">
                      {connection.title}
                      {connection.optional && (
                                                 <span className="ml-2 text-xs bg-white/20 text-white/60 px-2 py-1 rounded-full font-normal">
                           Optional
                         </span>
                      )}
                    </h3>
                    <p className="text-sm text-white/80">{connection.description}</p>
                  </div>
                </div>

                <Button
                  onClick={() => handleConnect(connection.id)}
                  disabled={isConnecting}
                  variant={isConnected ? "outline" : "default"}
                  className={`min-w-[100px] rounded-xl ${
                    isConnected
                      ? 'border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15'
                      : 'border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {isConnecting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : isConnected ? (
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>Connected</span>
                    </div>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>

              {/* Connection success animation */}
              {isConnected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={getSpringConfig(springConfigs.bouncy)}
                  className="mt-4 p-3 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20"
                >
                  <p className="text-sm text-white flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Successfully connected! Your {connection.title.toLowerCase()} is now integrated.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Skip message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
      >
        <p className="text-sm text-white">
          💡 Don't worry! You can connect these systems later from your dashboard settings.
        </p>
      </motion.div>

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
              <span>Saving...</span>
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </motion.div>
    </div>
  )
}
