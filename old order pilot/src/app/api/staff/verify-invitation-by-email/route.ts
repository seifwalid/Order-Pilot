import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // Find invitation by email
    const { data: invitation, error } = await adminSupabase
      .from('staff_invitations')
      .select(`
        *,
        restaurant:restaurants(id, name)
      `)
      .eq('email', email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'No valid invitation found for this email' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      invitation
    })

  } catch (error) {
    console.error('Verify invitation by email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
