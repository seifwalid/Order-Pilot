'use client'

import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'

interface PreviewCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function PreviewCard({ 
  title, 
  description, 
  children, 
  className = '' 
}: PreviewCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={getSpringConfig(springConfigs.gentle)}
      whileHover={{ 
        scale: 1.01,
        transition: getSpringConfig({ stiffness: 400, damping: 25 })
      }}
      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Eye className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-xs text-white/70">{description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`space-y-3 ${className.includes('flex flex-col') ? 'flex-1' : ''}`}>
        {children}
      </div>

      {/* Subtle animation indicator */}
      <motion.div
        className="mt-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </motion.div>
  )
}
