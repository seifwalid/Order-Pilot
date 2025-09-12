/**
 * API Adapter Layer for OrderPilot Onboarding
 * Maps the new onboarding contract to existing backend endpoints
 * DO NOT modify backend routes - this is the only place to adapt if endpoints differ
 */

import { createClient } from '@/lib/supabase/client'
import { createRestaurantSchema } from '@/lib/validations'

export interface OnboardingState {
  stepIndex: number
  restaurant: { name: string; location?: string; logoUrl?: string }
  integrations: { phone: boolean; pos: boolean; payments: boolean }
  team: { invites: string[] }
  menu: { mode: 'template' | 'scratch'; template?: 'fastCasual' | 'pizzeria' | 'cafe' }
  theme: { mode: 'light' | 'dark' | 'auto'; accent: string }
  voice: { enabled: boolean }
  serverHydrated: boolean
}

export interface OnboardingAPI {
  getState(): Promise<OnboardingState>
  updateIdentity(data: { name: string; location?: string; logoUrl?: string }): Promise<void>
  updateIntegrations(data: { phone: boolean; pos: boolean; payments: boolean }): Promise<void>
  inviteTeam(data: { emails: string[] }): Promise<void>
  updateMenu(data: { mode: 'template' | 'scratch'; template?: string }): Promise<void>
  updateTheme(data: { mode: 'light' | 'dark' | 'auto'; accent: string }): Promise<void>
  updateVoice(data: { enabled: boolean }): Promise<void>
  complete(data: { acknowledged: true }): Promise<void>
}

class OnboardingAPIImpl implements OnboardingAPI {
  private async getSupabase() {
    return await createClient()
  }

  async getState(): Promise<OnboardingState> {
    try {
      // Get current user
      const supabase = await this.getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check if restaurant exists
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (restaurantError && restaurantError.code !== 'PGRST116') {
        // Real error, not just "no rows found"
        throw restaurantError
      }

      if (!restaurant) {
        // No restaurant yet - return initial state
        return {
          stepIndex: 0,
          restaurant: { name: '', location: '', logoUrl: '' },
          integrations: { phone: false, pos: false, payments: false },
          team: { invites: [] },
          menu: { mode: 'template', template: 'fastCasual' },
          theme: { mode: 'light', accent: '#ae8d5e' },
          voice: { enabled: false },
          serverHydrated: true,
        }
      }

      // Restaurant exists - determine current step based on completion
      let stepIndex = 1 // Start after identity if restaurant exists
      
      // Check if onboarding is completed
      if (restaurant.onboarding_completed) {
        stepIndex = 7 // All steps completed
      }

      return {
        stepIndex,
        restaurant: {
          name: restaurant.name || '',
          location: restaurant.address || '',
          logoUrl: '', // Not implemented in current schema
        },
        integrations: { phone: false, pos: false, payments: false }, // Not tracked yet
        team: { invites: [] }, // Could fetch pending invitations
        menu: { mode: 'template', template: 'fastCasual' }, // Default
        theme: { mode: 'light', accent: '#ae8d5e' }, // Default
        voice: { enabled: false }, // Not tracked yet
        serverHydrated: true,
      }
    } catch (error) {
      console.error('Failed to get onboarding state:', error)
      throw error
    }
  }

  async updateIdentity(data: { name: string; location?: string; logoUrl?: string }): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Validate data using existing schema
      const validatedData = createRestaurantSchema.parse({
        name: data.name,
        email: user.email!, // Use user's email as business email
        phone: '', // Optional
        address: data.location || '',
      })

      // Check if restaurant already exists
      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (existingRestaurant) {
        // Update existing restaurant
        const { error } = await supabase
          .from('restaurants')
          .update({
            name: validatedData.name,
            address: validatedData.address,
          })
          .eq('id', existingRestaurant.id)

        if (error) throw error
      } else {
        // Create new restaurant (matches existing onboarding logic)
        const { data: restaurant, error: restaurantError } = await supabase
          .from('restaurants')
          .insert({
            ...validatedData,
            owner_id: user.id,
          })
          .select()
          .single()

        if (restaurantError) throw restaurantError

        // Create restaurant settings (matches existing onboarding logic)
        const { error: settingsError } = await supabase
          .from('restaurant_settings')
          .insert({
            restaurant_id: restaurant.id,
          })

        if (settingsError) throw settingsError
      }
    } catch (error) {
      console.error('Failed to update identity:', error)
      throw error
    }
  }

  async updateIntegrations(data: { phone: boolean; pos: boolean; payments: boolean }): Promise<void> {
    // Integrations are not currently tracked in the database
    // This is a placeholder for future implementation
    console.log('Integrations updated (not persisted):', data)
  }

  async inviteTeam(data: { emails: string[] }): Promise<void> {
    try {
      // Validate emails array
      if (!data.emails || !Array.isArray(data.emails)) {
        console.warn('No emails provided for team invitations')
        return
      }

      // Use existing staff invitation endpoint
      for (const email of data.emails) {
        if (!email.trim()) continue

        const response = await fetch('/api/staff/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            role: 'staff', // Default role
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to send invitation')
        }
      }
    } catch (error) {
      console.error('Failed to invite team:', error)
      throw error
    }
  }

  async updateMenu(data: { mode: 'template' | 'scratch'; template?: string }): Promise<void> {
    // Menu templates are not currently implemented in the backend
    // This is a placeholder for future implementation
    console.log('Menu updated (not persisted):', data)
  }

  async updateTheme(data: { mode: 'light' | 'dark' | 'auto'; accent: string }): Promise<void> {
    // Theme preferences are not currently tracked in the database
    // This is a placeholder for future implementation
    console.log('Theme updated (not persisted):', data)
  }

  async updateVoice(data: { enabled: boolean }): Promise<void> {
    // Voice settings are not currently tracked in the database
    // This is a placeholder for future implementation
    console.log('Voice updated (not persisted):', data)
  }

  async complete(data: { acknowledged: true }): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (!restaurant) throw new Error('Restaurant not found')

      // Mark onboarding as completed (matches existing logic)
      const { error } = await supabase
        .from('restaurants')
        .update({ onboarding_completed: true })
        .eq('id', restaurant.id)

      if (error) throw error
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      throw error
    }
  }
}

// Export singleton instance
export const onboardingAPI = new OnboardingAPIImpl()

// Default state for new users
export const defaultOnboardingState: OnboardingState = {
  stepIndex: 0,
  restaurant: { name: '', location: '', logoUrl: '' },
  integrations: { phone: false, pos: false, payments: false },
  team: { invites: [] },
  menu: { mode: 'template', template: 'fastCasual' },
  theme: { mode: 'light', accent: '#ae8d5e' },
  voice: { enabled: false },
  serverHydrated: false,
}
