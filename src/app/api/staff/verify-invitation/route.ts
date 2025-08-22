import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for invitation verification
    const adminSupabase = createAdminClient()
    
    const { data: invitation, error } = await adminSupabase
      .from('staff_invitations')
      .select(`
        *,
        restaurant:restaurants(name, email)
      `)
      .eq('token', token)
      .eq('status', 'pending')
      .single()

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token or invitation has already been accepted' },
        { status: 404 }
      )
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This invitation has expired. Please contact your manager for a new invitation.' },
        { status: 410 }
      )
    }

    return NextResponse.json({ 
      success: true,
      invitation 
    })

  } catch (error) {
    console.error('Error verifying invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
