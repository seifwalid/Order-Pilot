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
    name: 'OrderPilot Gold',
    value: '#ae8d5e',
    foreground: '#ffffff',
    description: 'Brand signature color'
  },
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
 * Darkens a hex color by a specified percentage.
 * @param hex The hex color string (e.g., "#ae8d5e").
 * @param percent The percentage to darken by (e.g., 20).
 * @returns The new darkened hex color string.
 */
function darkenColor(hex: string, percent: number): string {
  if (!hex || !hex.startsWith('#')) return '#000000';

  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Apply theme to CSS custom properties
 */
export function applyTheme(theme: { mode: 'default' | 'light' | 'dark' | 'auto', accent: string }): void {
  const root = document.documentElement;

  // Reset classes first
  root.classList.remove('dark', 'light');

  if (theme.mode === 'default') {
    // EXACT onboarding colors - #0f1216 background, white/5 cards, white text
    root.classList.add('dark');
    
    // Core onboarding colors
    root.style.setProperty('--background', '216 20% 6.3%'); // #0f1216
    root.style.setProperty('--foreground', '0 0% 100%'); // white
    root.style.setProperty('--card', '0 0% 100% / 0.05'); // bg-white/5
    root.style.setProperty('--card-foreground', '0 0% 100%'); // text-white
    root.style.setProperty('--muted', '0 0% 100% / 0.05'); // bg-white/5
    root.style.setProperty('--muted-foreground', '0 0% 70%'); // text-white/70
    root.style.setProperty('--border', '0 0% 100% / 0.1'); // border-white/10
    root.style.setProperty('--input', '0 0% 100% / 0.1'); // border-white/10
    
    // Fixed brand colors
    root.style.setProperty('--accent', '#ae8d5e'); // OrderPilot gold
    root.style.setProperty('--accent-foreground', '#ffffff');
    root.style.setProperty('--accent-hover', '#9a7a4a');
    root.style.setProperty('--accent-muted', 'rgba(174, 141, 94, 0.15)');
    root.style.setProperty('--secondary-accent', '#10b981'); // emerald-500
    root.style.setProperty('--secondary-accent-foreground', '#ffffff');
    
    // Other semantic colors
    root.style.setProperty('--primary', '0 0% 100%'); // white
    root.style.setProperty('--primary-foreground', '216 20% 6.3%'); // dark bg
    root.style.setProperty('--secondary', '0 0% 100% / 0.1'); // white/10
    root.style.setProperty('--secondary-foreground', '0 0% 100%'); // white
    root.style.setProperty('--popover', '216 20% 6.3%'); // same as bg
    root.style.setProperty('--popover-foreground', '0 0% 100%'); // white

  } else {
    // Customizable light/dark themes
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else if (theme.mode === 'light') {
      root.classList.remove('dark');
    } else if (theme.mode === 'auto') {
      // Handle 'auto' mode - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Clear onboarding overrides to use CSS defaults
    root.style.removeProperty('--background');
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--card');
    root.style.removeProperty('--card-foreground');
    root.style.removeProperty('--muted');
    root.style.removeProperty('--muted-foreground');
    root.style.removeProperty('--border');
    root.style.removeProperty('--input');
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-foreground');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--secondary-foreground');
    root.style.removeProperty('--popover');
    root.style.removeProperty('--popover-foreground');

    // Apply user-selected accent color
    const accentForeground = getBestForeground(theme.accent);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-foreground', accentForeground);
    
    const accentRgb = hexToRgb(theme.accent);
    if (accentRgb) {
      const { r, g, b } = accentRgb;
      const hover = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`;
      root.style.setProperty('--accent-hover', hover);
      root.style.setProperty('--accent-muted', `rgba(${r}, ${g}, ${b}, 0.1)`);
    }

    // Derive secondary accent (20% darker)
    const secondaryAccent = darkenColor(theme.accent, 20);
    const secondaryForeground = getBestForeground(secondaryAccent);
    root.style.setProperty('--secondary-accent', secondaryAccent);
    root.style.setProperty('--secondary-accent-foreground', secondaryForeground);
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use applyTheme instead
 */
export function applyAccentColor(accent: string): void {
  applyTheme({ mode: 'default', accent });
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
