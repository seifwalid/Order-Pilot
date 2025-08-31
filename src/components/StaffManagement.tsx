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
        <Card className="bg-slate-800/50 backdrop-blur-3xl border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white font-medium">Invite New Staff Member</CardTitle>
            <CardDescription className="text-white/70">
              Send an invitation to add a new team member to your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="staff@example.com"
                    required
                    className="bg-slate-700/50 border-slate-600 text-white !text-white placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white font-medium">Role</Label>
                  <select
                    id="role"
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as 'manager' | 'staff' }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white !text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    aria-label="Select staff role"
                  >
                    <option value="staff" className="bg-slate-700 text-white">Staff Member</option>
                    <option value="manager" className="bg-slate-700 text-white">Manager</option>
                  </select>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800/50 backdrop-blur-3xl border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white font-medium">Current Staff Members</CardTitle>
          <CardDescription className="text-white/70">
            Manage your restaurant's team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 border border-slate-600/50 rounded-lg bg-slate-700/30">
                <div>
                  <p className="font-medium text-white">{staff.email || 'Unknown'}</p>
                  <Badge variant="secondary" className="capitalize bg-slate-500/20 text-slate-300 border-slate-500/30">
                    {staff.role}
                  </Badge>
                </div>
                
                {canManageStaff && staff.role !== 'owner' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleRemoveStaff(staff.id)}
                    className="bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30"
                  >
                    {isLoading ? 'Removing...' : 'Remove'}
                  </Button>
                )}
              </div>
            ))}
            
            {staffMembers.length === 0 && (
              <p className="text-white/70 text-center py-4">No staff members found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {canManageStaff && pendingInvitations.length > 0 && (
        <Card className="bg-slate-800/50 backdrop-blur-3xl border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white font-medium">Pending Invitations</CardTitle>
            <CardDescription className="text-white/70">
              Invitations that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border border-slate-600/50 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="font-medium text-white">{invitation.email}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize bg-slate-500/20 text-slate-300 border-slate-500/30">
                        {invitation.role}
                      </Badge>
                      <Badge variant="outline" className="border-slate-500/30 text-slate-300">
                        Pending
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleRevokeInvitation(invitation.id)}
                    className="bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30"
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
