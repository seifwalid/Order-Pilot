'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Building2, 
  Users, 
  ChefHat, 
  Palette, 
  Mic, 
  ArrowRight,
  Edit2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { canCompleteStep } from '../_state/useWizardState'
import type { StepComponentProps } from './Wizard'

export default function StepSummary({ 
  state, 
  actions, 
  isLoading, 
  onBack,
  onJumpTo,
  onComplete 
}: StepComponentProps) {
  const canProceed = canCompleteStep(state, 7)

  const summaryItems = [
    {
      icon: Building2,
      title: 'Restaurant Identity',
      stepIndex: 1,
      content: (
        <div className="space-y-1">
          <p className="font-medium text-white">{state.restaurant.name || 'Not set'}</p>
          {state.restaurant.location && (
            <p className="text-sm text-white/70">{state.restaurant.location}</p>
          )}
        </div>
      ),
      isComplete: !!state.restaurant.name,
    },
    {
      icon: Users,
      title: 'Team Invitations',
      stepIndex: 3,
      content: (
        <div className="space-y-1">
          {state.team.invites.length > 0 ? (
            <>
              <p className="font-medium text-white">
                {state.team.invites.length} member{state.team.invites.length !== 1 ? 's' : ''} invited
              </p>
              <div className="flex flex-wrap gap-1">
                {state.team.invites.slice(0, 2).map((email) => (
                  <Badge key={email} variant="secondary" className="text-xs">
                    {email}
                  </Badge>
                ))}
                {state.team.invites.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{state.team.invites.length - 2} more
                  </Badge>
                )}
              </div>
            </>
          ) : (
            <p className="text-white/70">No team members invited</p>
          )}
        </div>
      ),
      isComplete: state.team.invites.length > 0,
    },
    {
      icon: ChefHat,
      title: 'Menu Setup',
      stepIndex: 4,
      content: (
        <div className="space-y-1">
          {state.menu.mode === 'template' && state.menu.template ? (
            <>
              <p className="font-medium text-white">
                {state.menu.template === 'fastCasual' ? 'Fast Casual' :
                 state.menu.template === 'pizzeria' ? 'Pizzeria' :
                 state.menu.template === 'cafe' ? 'Café' : 'Template'} Menu
              </p>
              <p className="text-sm text-white/70">Template-based menu</p>
            </>
          ) : (
            <>
              <p className="font-medium text-white">Custom Menu</p>
              <p className="text-sm text-white/70">Build from scratch</p>
            </>
          )}
        </div>
      ),
      isComplete: true,
    },
    {
      icon: Palette,
      title: 'Appearance',
      stepIndex: 6,
      content: (
        <div className="space-y-1">
          <p className="font-medium text-white capitalize">
            {state.theme.mode === 'auto' ? 'Auto' : 
             state.theme.mode === 'dark' ? 'Dark' : 'Light'} Mode
          </p>
          <p className="text-sm text-white/70">
            Dashboard appearance preference
          </p>
        </div>
      ),
      isComplete: true,
    },
    {
      icon: Mic,
      title: 'Voice Ordering',
      stepIndex: 5,
      content: (
        <div className="space-y-1">
          <p className={`font-medium ${
            state.voice.enabled ? 'text-white' : 'text-white/60'
          }`}>
            {state.voice.enabled ? 'Enabled' : 'Disabled'}
          </p>
          <p className="text-sm text-white/70">
            {state.voice.enabled 
              ? 'AI phone assistant active'
              : 'Can be enabled later'
            }
          </p>
        </div>
      ),
      isComplete: true,
    },
  ]

  const completedCount = summaryItems.filter(item => item.isComplete).length

  return (
    <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig(springConfigs.gentle)}
        className="text-center space-y-2"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          You're all set!
        </h2>
        <p className="text-white/80">
          Review your setup and launch your restaurant dashboard
        </p>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
        className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="font-semibold text-white">Setup Complete</h3>
        </div>
        <p className="text-white">
          <span className="font-semibold">{completedCount}</span> of {summaryItems.length} sections configured
        </p>
        <div className="flex justify-center mt-3 space-x-1">
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                item.isComplete ? 'bg-green-500' : 'bg-green-200'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {summaryItems.map((item, index) => {
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={getSpringConfig({
                ...springConfigs.gentle,
                stiffness: 280 - index * 15
              })}
              className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.isComplete ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    item.isComplete ? 'text-white' : 'text-white/60'
                  }`} />
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-1">
                    {item.title}
                  </h4>
                  {item.content}
                </div>
              </div>

              <Button
                onClick={() => onJumpTo?.(item.stepIndex)}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Launch Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 200 })}
        className="text-center space-y-6 p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      >
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">
            Ready to launch your kitchen! 🚀
          </h3>
          <p className="text-white/80 max-w-md mx-auto">
            Your OrderPilot dashboard is configured and ready. 
            Start managing orders, menu, and team right away.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onComplete}
            disabled={!canProceed || isLoading}
            size="lg"
            className={`px-8 py-4 font-medium rounded-xl transition-all duration-200 ${
              canProceed
                ? 'bg-[#ae8d5e] hover:bg-[#9a7a4a] text-white shadow-lg shadow-[#ae8d5e]/30 hover:shadow-[#9a7a4a]/40 transform hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Launching Dashboard...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Enter Your Kitchen</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>

        {/* Quick stats preview */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto pt-4">
          {[
            { label: 'Orders', value: '0', icon: '📋' },
            { label: 'Menu Items', value: state.menu.mode === 'template' ? '12+' : '0', icon: '🍽️' },
            { label: 'Team', value: state.team.invites.length.toString(), icon: '👥' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 180 })}
        className="flex items-center justify-between pt-6 border-t"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white/70 hover:text-white"
        >
          Back
        </Button>

        <div className="text-sm text-white/70">
          🎉 Setup complete! Ready to launch.
        </div>
      </motion.div>
    </div>
  )
}
