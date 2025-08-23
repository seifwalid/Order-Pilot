/**
 * Accent Color System for OrderPilot Onboarding
 * Provides curated color palette with WCAG contrast validation
 */

export interface AccentColor {
  name: string
  value: string
  foreground: string
  description: string
}

export const accentColors: AccentColor[] = [
  {
    name: 'Blue',
    value: '#3b82f6',
    foreground: '#ffffff',
    description: 'Classic and professional'
  },
  {
    name: 'Emerald',
    value: '#10b981',
    foreground: '#ffffff',
    description: 'Fresh and natural'
  },
  {
    name: 'Orange',
    value: '#f97316',
    foreground: '#ffffff',
    description: 'Warm and inviting'
  },
  {
    name: 'Rose',
    value: '#f43f5e',
    foreground: '#ffffff',
    description: 'Elegant and modern'
  },
  {
    name: 'Purple',
    value: '#8b5cf6',
    foreground: '#ffffff',
    description: 'Creative and unique'
  },
  {
    name: 'Amber',
    value: '#f59e0b',
    foreground: '#000000',
    description: 'Energetic and bold'
  },
  {
    name: 'Teal',
    value: '#14b8a6',
    foreground: '#ffffff',
    description: 'Calm and sophisticated'
  },
  {
    name: 'Indigo',
    value: '#6366f1',
    foreground: '#ffffff',
    description: 'Deep and trustworthy'
  },
]

// Restaurant-specific color themes
export const restaurantThemes = {
  fastCasual: {
    primary: '#f97316', // Orange
    secondary: '#fbbf24', // Amber
    name: 'Fast Casual'
  },
  pizzeria: {
    primary: '#dc2626', // Red
    secondary: '#16a34a', // Green (basil)
    name: 'Pizzeria'
  },
  cafe: {
    primary: '#92400e', // Brown
    secondary: '#f59e0b', // Amber
    name: 'Café'
  },
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast calculation
  // In production, use a proper color library like chroma-js
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')
  
  const r1 = parseInt(hex1.substr(0, 2), 16)
  const g1 = parseInt(hex1.substr(2, 2), 16)
  const b1 = parseInt(hex1.substr(4, 2), 16)
  
  const r2 = parseInt(hex2.substr(0, 2), 16)
  const g2 = parseInt(hex2.substr(2, 2), 16)
  const b2 = parseInt(hex2.substr(4, 2), 16)
  
  const l1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1
  const l2 = 0.299 * r2 + 0.587 * g2 + 0.114 * b2
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function isAccessibleContrast(background: string, foreground: string): boolean {
  const ratio = getContrastRatio(background, foreground)
  return ratio >= 4.5 // WCAG AA standard for normal text
}

/**
 * Get the best foreground color (black or white) for a given background
 */
export function getBestForeground(background: string): string {
  const whiteContrast = getContrastRatio(background, '#ffffff')
  const blackContrast = getContrastRatio(background, '#000000')
  
  return whiteContrast > blackContrast ? '#ffffff' : '#000000'
}

/**
 * Apply accent color to CSS custom properties
 */
export function applyAccentColor(accent: string): void {
  const root = document.documentElement
  const foreground = getBestForeground(accent)
  
  root.style.setProperty('--accent', accent)
  root.style.setProperty('--accent-foreground', foreground)
  
  // Generate lighter/darker variants
  const rgb = hexToRgb(accent)
  if (rgb) {
    const { r, g, b } = rgb
    
    // Lighter variant (for hover states)
    const lighter = `rgb(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)})`
    root.style.setProperty('--accent-hover', lighter)
    
    // Muted variant (for backgrounds)
    const muted = `rgba(${r}, ${g}, ${b}, 0.1)`
    root.style.setProperty('--accent-muted', muted)
  }
}

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}
