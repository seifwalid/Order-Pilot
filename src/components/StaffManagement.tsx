'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface StaffManagementProps {
  restaurant: any
  role: string
  staffMembers: any[]
  pendingInvitations: any[]
}

export default function StaffManagement({ restaurant, role, staffMembers, pendingInvitations }: StaffManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'staff' as 'manager' | 'staff',
  })

  const supabase = createClient()

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/staff/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteForm.email,
          role: inviteForm.role,
          restaurantId: restaurant.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to send invitation')

      alert('Invitation sent successfully!')
      setInviteForm({ email: '', role: 'staff' })
      
      // Refresh the page to show new invitation
      window.location.reload()
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevokeInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/staff/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationId: invitationId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to revoke invitation')
      }

      alert('Invitation deleted successfully!')
      window.location.reload()
    } catch (error) {
      console.error('Error revoking invitation:', error)
      alert(error instanceof Error ? error.message : 'Failed to revoke invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/staff/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staffId: staffId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove staff member')
      }

      alert('Staff member removed successfully!')
      window.location.reload()
    } catch (error) {
      console.error('Error removing staff:', error)
      alert(error instanceof Error ? error.message : 'Failed to remove staff member')
    } finally {
      setIsLoading(false)
    }
  }

  // Only owners and managers can manage staff
  const canManageStaff = role === 'owner' || role === 'manager'

  return (
    <div className="space-y-6">
      {canManageStaff && (
        <Card>
          <CardHeader>
            <CardTitle>Invite New Staff Member</CardTitle>
            <CardDescription>
              Send an invitation to add a new team member to your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="staff@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as 'manager' | 'staff' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="staff">Staff Member</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Staff Members</CardTitle>
          <CardDescription>
            Manage your restaurant's team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{staff.email || 'Unknown'}</p>
                  <Badge variant="secondary" className="capitalize">
                    {staff.role}
                  </Badge>
                </div>
                
                {canManageStaff && staff.role !== 'owner' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleRemoveStaff(staff.id)}
                  >
                    {isLoading ? 'Removing...' : 'Remove'}
                  </Button>
                )}
              </div>
            ))}
            
            {staffMembers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No staff members found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {canManageStaff && pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Invitations that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        {invitation.role}
                      </Badge>
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleRevokeInvitation(invitation.id)}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
