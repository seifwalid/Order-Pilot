'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createRestaurantSchema } from '@/lib/validations'
import { z } from 'zod'

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [staffInvites, setStaffInvites] = useState([
    { email: '', role: 'manager' as const },
  ])

  const router = useRouter()
  const supabase = createClient()

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validate form data
      const validatedData = createRestaurantSchema.parse(formData)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Create restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          ...validatedData,
          owner_id: user.id,
        })
        .select()
        .single()

      if (restaurantError) throw restaurantError

      // Create restaurant settings
      const { error: settingsError } = await supabase
        .from('restaurant_settings')
        .insert({
          restaurant_id: restaurant.id,
        })

      if (settingsError) throw settingsError

      setStep(2)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleStaffInvites = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Get current user and restaurant
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!restaurant) throw new Error('Restaurant not found')

      // Filter out empty email invites
      const validInvites = staffInvites.filter(invite => invite.email.trim())

      if (validInvites.length > 0) {
        // Send staff invitations using API route (which handles email sending)
        for (const invite of validInvites) {
          const response = await fetch('/api/staff/invite', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: invite.email.trim(),
              role: invite.role,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to send invitation')
          }
        }
      }

      // Mark onboarding as completed
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ onboarding_completed: true })
        .eq('id', restaurant.id)

      if (updateError) throw updateError

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addStaffInvite = () => {
    setStaffInvites([...staffInvites, { email: '', role: 'staff' }])
  }

  const removeStaffInvite = (index: number) => {
    setStaffInvites(staffInvites.filter((_, i) => i !== index))
  }

  const updateStaffInvite = (index: number, field: string, value: string) => {
    const updated = [...staffInvites]
    updated[index] = { ...updated[index], [field]: value }
    setStaffInvites(updated)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
              variant="outline"
              size="sm"
            >
              Sign Out
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to OrderPilot!
          </h1>
          <p className="text-gray-600 mt-2">
            Let's get your restaurant set up in just a few steps
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Restaurant Info</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Invite Staff</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Tell us about your restaurant to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRestaurantSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your restaurant name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your business email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your restaurant address"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Restaurant...' : 'Continue'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Invite Your Team</CardTitle>
              <CardDescription>
                Invite managers and staff to help run your restaurant (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {staffInvites.map((invite, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`email-${index}`}>Email</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={invite.email}
                        onChange={(e) => updateStaffInvite(index, 'email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`role-${index}`}>Role</Label>
                      <select
                        id={`role-${index}`}
                        value={invite.role}
                        onChange={(e) => updateStaffInvite(index, 'role', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                    {staffInvites.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeStaffInvite(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addStaffInvite}
                className="w-full"
              >
                + Add Another Team Member
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleStaffInvites}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Finishing Setup...' : 'Complete Setup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
