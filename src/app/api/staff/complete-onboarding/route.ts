import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      invitationId,
      firstName,
      lastName,
      employeeId,
      phoneNumber,
      emergencyContact,
      emergencyPhone,
      startDate
    } = body

    // Get the current user
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use admin client to bypass RLS for this operation
    const adminSupabase = createAdminClient()

    // First, verify the invitation exists and is valid
    const { data: invitation, error: invitationError } = await adminSupabase
      .from('staff_invitations')
      .select('*')
      .eq('id', invitationId)
      .eq('email', user.email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (invitationError || !invitation) {
      console.error('Invitation verification failed:', invitationError)
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 })
    }

    // Update invitation status to accepted
    const { error: updateInvitationError } = await adminSupabase
      .from('staff_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invitationId)

    if (updateInvitationError) {
      console.error('Failed to update invitation:', updateInvitationError)
      return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 })
    }

    // Create staff record using admin client
    const { error: staffError } = await adminSupabase
      .from('restaurant_staff')
      .insert({
        restaurant_id: invitation.restaurant_id,
        user_id: user.id,
        role: invitation.role,
        first_name: firstName,
        last_name: lastName,
        employee_id: employeeId,
        phone_number: phoneNumber,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        start_date: startDate,
        accepted_at: new Date().toISOString(),
      })

    if (staffError) {
      console.error('Failed to create staff record:', staffError)
      return NextResponse.json({ error: 'Failed to create staff record' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Staff onboarding completed successfully',
      restaurantId: invitation.restaurant_id
    })

  } catch (error) {
    console.error('Complete onboarding error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
