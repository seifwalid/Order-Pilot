'use client'

import { motion } from 'framer-motion'
import { getSpringConfig } from '@/lib/a11y/reducedMotion'

interface WaveformProps {
  isActive?: boolean
  className?: string
}

export default function Waveform({ isActive = true, className = '' }: WaveformProps) {
  const bars = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className={`flex items-end justify-center space-x-1 h-8 ${className}`}>
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="waveform-bar w-1 bg-current rounded-full"
          initial={{ scaleY: 0.3 }}
          animate={isActive ? {
            scaleY: [0.3, 1, 0.3],
          } : { scaleY: 0.6 }}
          transition={isActive ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bar * 0.1,
          } : getSpringConfig({ stiffness: 300, damping: 30 })}
          style={{ transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  )
}
