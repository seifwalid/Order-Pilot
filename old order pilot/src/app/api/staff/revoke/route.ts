import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRestaurant } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { invitationId } = await request.json()

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { restaurant, role } = await getUserRestaurant(user.id)

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Only owners and managers can revoke invitations
    if (role !== 'owner' && role !== 'manager') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // First, verify the invitation belongs to this restaurant
    const { data: invitation, error: fetchError } = await supabase
      .from('staff_invitations')
      .select('*')
      .eq('id', invitationId)
      .eq('restaurant_id', restaurant.id)
      .single()

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only revoke pending invitations' },
        { status: 400 }
      )
    }

    // Delete the invitation (revoke by removing it entirely)
    const adminSupabase = createAdminClient()
    const { error: deleteError } = await adminSupabase
      .from('staff_invitations')
      .delete()
      .eq('id', invitationId)

    if (deleteError) {
      console.error('Error deleting invitation:', deleteError)
      return NextResponse.json(
        { error: `Failed to revoke invitation: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Invitation deleted successfully' 
    })

  } catch (error) {
    console.error('Error in revoke invitation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
