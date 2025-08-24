import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { inviteStaffSchema } from '@/lib/validations'
import { sendStaffInvitation, logStaffInvitation } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = inviteStaffSchema.parse(body)

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name')
      .eq('owner_id', user.id)
      .single()

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Check if invitation already exists for this email
    const { data: existingInvitation } = await supabase
      .from('staff_invitations')
      .select('id')
      .eq('restaurant_id', restaurant.id)
      .eq('email', validatedData.email)
      .eq('status', 'pending')
      .single()

    if (existingInvitation) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 })
    }

    // Create staff invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('staff_invitations')
      .insert({
        restaurant_id: restaurant.id,
        email: validatedData.email,
        role: validatedData.role,
        invited_by: user.id,
      })
      .select()
      .single()

    if (invitationError) {
      return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 })
    }

    // Get inviter's name from user metadata or email
    const inviterName = user.user_metadata?.full_name || user.email || 'Restaurant Owner'

    // Create invitation URL using the request host
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
    const invitationUrl = `${baseUrl}/staff-onboarding?token=${invitation.token}`
    console.log('🔗 Generated invitation URL:', invitationUrl)

    // Try Supabase invite first (simpler approach)
    const adminSupabase = createAdminClient()
    console.log('🔍 Attempting Supabase invite for:', validatedData.email)
    
    // Use auth/callback and pass params via query string
    const supabaseRedirectUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent('/staff-onboarding')}&email=${encodeURIComponent(validatedData.email)}&supabase_invite=true`
    console.log('🔗 Supabase redirect URL:', supabaseRedirectUrl)
    
    const { data: supabaseInvite, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(
      validatedData.email,
      {
        redirectTo: supabaseRedirectUrl,
        data: {
          invitation_id: invitation.id,
          restaurant_name: restaurant.name,
          role: validatedData.role,
          inviter_name: inviterName,
        }
      }
    )

    if (!inviteError) {
      console.log('✅ Supabase invitation sent successfully:', supabaseInvite)
      return NextResponse.json({ 
        success: true, 
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
        },
        method: 'supabase_invite',
        message: 'Staff invitation sent successfully via Supabase'
      })
    } else {
      console.log('❌ Supabase invite failed:', inviteError.message)
      console.log('❌ Full error details:', inviteError)
      
      // Return error instead of falling back
      return NextResponse.json({ 
        error: `Failed to send Supabase invitation: ${inviteError.message}`,
        details: inviteError
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Staff invitation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}