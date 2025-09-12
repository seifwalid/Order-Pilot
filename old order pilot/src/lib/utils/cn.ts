/**
 * Utility for merging Tailwind CSS classes
 * Enhanced version of the standard cn utility with better conflict resolution
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge classes with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Conditional class utility
 */
export function cva(base: string, variants: Record<string, Record<string, string>>) {
  return (props: Record<string, string | boolean | undefined>) => {
    const classes = [base]
    
    Object.entries(variants).forEach(([key, options]) => {
      const value = props[key]
      if (value && typeof value === 'string' && options[value]) {
        classes.push(options[value])
      }
    })
    
    return cn(...classes)
  }
}
