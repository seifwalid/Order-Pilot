'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, X, Crown, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import type { StepComponentProps } from './Wizard'

const roleInfo = {
  owner: {
    icon: Crown,
    label: 'Owner',
    description: 'Full access to all features and settings',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  manager: {
    icon: Shield,
    label: 'Manager',
    description: 'Manage orders, menu, and staff',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  staff: {
    icon: User,
    label: 'Staff',
    description: 'Handle orders and customer service',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
}

export default function StepTeam({ 
  state, 
  actions, 
  isLoading, 
  onNext, 
  onBack 
}: StepComponentProps) {
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')

  const addEmail = () => {
    const email = emailInput.trim()
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Please enter an email address')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    if (state.team.invites.includes(email)) {
      setEmailError('This email has already been added')
      return
    }

    actions.updateTeam({
      invites: [...state.team.invites, email]
    })
    setEmailInput('')
    setEmailError('')
  }

  const removeEmail = (emailToRemove: string) => {
    actions.updateTeam({
      invites: state.team.invites.filter(email => email !== emailToRemove)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addEmail()
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
          <Users className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Build your team
        </h2>
        <p className="text-white/80">
          Invite staff members to help manage your restaurant
        </p>
      </motion.div>

      {/* Role Explanation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 260 })}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {Object.entries(roleInfo).map(([role, info]) => {
          const Icon = info.icon
          return (
            <div
              key={role}
              className="p-4 rounded-xl border border-white/20 bg-black/20 backdrop-blur-xl"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="w-5 h-5 text-white/80" />
                                 <Badge variant="outline" className="bg-white/20 text-white/60 border-white/30 font-normal">
                   {info.label}
                 </Badge>
              </div>
              <p className="text-sm text-white/80">{info.description}</p>
            </div>
          )
        })}
      </motion.div>

      {/* Email Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
        className="space-y-4"
      >
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value)
                setEmailError('')
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter team member email"
              className="h-12 accent-focus"
            />
            {emailError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 mt-1"
              >
                {emailError}
              </motion.p>
            )}
          </div>
          <Button
            onClick={addEmail}
            className="h-12 px-6 rounded-xl border-white/50 text-white bg-white/5 hover:border-white/70 hover:text-white hover:bg-white/15"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <p className="text-sm text-white/70">
          Team members will receive an email invitation to join your restaurant
        </p>
      </motion.div>

      {/* Invited Emails */}
      <AnimatePresence>
        {state.team.invites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={getSpringConfig(springConfigs.gentle)}
            className="space-y-3"
          >
            <h3 className="font-semibold text-white flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Team Invitations ({state.team.invites.length})
            </h3>
            
            <div className="space-y-2">
              {state.team.invites.map((email, index) => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={getSpringConfig({
                    ...springConfigs.gentle,
                    stiffness: 300 - index * 20
                  })}
                  className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{email}</p>
                      <Badge variant="outline" className="text-xs bg-white/20 text-white/80 border-white/30">
                        Pending Invitation
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => removeEmail(email)}
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {state.team.invites.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
        >
          <Users className="w-12 h-12 text-white/60 mx-auto mb-3" />
          <p className="text-white mb-2">No team members invited yet</p>
          <p className="text-sm text-white/70">
            Add email addresses above to invite your team
          </p>
        </motion.div>
      )}

      {/* Skip message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
      >
        <p className="text-sm text-white">
          👥 You can always invite team members later from your dashboard
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
              <span>Sending Invites...</span>
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </motion.div>
    </div>
  )
}
