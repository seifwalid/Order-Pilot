'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

interface TypewriterProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  onComplete?: () => void
}

export function Typewriter({ 
  text, 
  className = '', 
  speed = 50, 
  delay = 0,
  cursor = true,
  onComplete 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = useCallback(() => {
    if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [isComplete, onComplete])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, currentIndex === 0 ? delay : speed)

      return () => clearTimeout(timeout)
    } else {
      handleComplete()
    }
  }, [currentIndex, text, speed, delay, handleComplete])

  // Reset when text changes
  useEffect(() => {
    if (text) {
      setDisplayText('')
      setCurrentIndex(0)
      setIsComplete(false)
    }
  }, [text])

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span className="typewriter-cursor inline-block w-0.5 h-[1em] bg-current ml-0.5" />
      )}
    </span>
  )
}

interface TypewriterSequenceProps {
  sequence: Array<{
    text: string
    delay?: number
    speed?: number
    pause?: number
  }>
  className?: string
  onComplete?: () => void
}

export function TypewriterSequence({ 
  sequence, 
  className = '',
  onComplete 
}: TypewriterSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSequenceComplete, setIsSequenceComplete] = useState(false)

  const handleStepComplete = () => {
    if (currentStep < sequence.length - 1) {
      const currentItem = sequence[currentStep]
      const pauseTime = currentItem.pause || 500
      
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, pauseTime)
    } else if (!isSequenceComplete) {
      setIsSequenceComplete(true)
      onComplete?.()
    }
  }

  // Reset when sequence changes
  useEffect(() => {
    if (sequence && sequence.length > 0) {
      setCurrentStep(0)
      setIsSequenceComplete(false)
    }
  }, [sequence])

  if (sequence.length === 0) return null

  const currentItem = sequence[currentStep]

  return (
    <div className={className}>
      {sequence.map((item, index) => (
        <div key={index} className={index === currentStep ? 'block' : 'hidden'}>
          <Typewriter
            text={item.text}
            speed={item.speed}
            delay={item.delay}
            onComplete={handleStepComplete}
          />
        </div>
      ))}
    </div>
  )
}

// Apple-style handwritten effect with slight randomness
export function HandwrittenText({ 
  text, 
  className = '',
  speed = 80,
  delay = 0 
}: Omit<TypewriterProps, 'cursor'>) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      // Add slight randomness to speed for more natural feel
      const randomSpeed = speed + (Math.random() - 0.5) * 30
      
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, currentIndex === 0 ? delay : Math.max(20, randomSpeed))

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed, delay])

  // Reset when text changes
  useEffect(() => {
    if (text) {
      setDisplayText('')
      setCurrentIndex(0)
    }
  }, [text])

  return (
    <motion.span 
      className={`handwritten-text font-playfair ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.1,
            delay: index * 0.02,
            ease: "easeOut"
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}
