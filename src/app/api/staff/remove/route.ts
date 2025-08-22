import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRestaurant } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { staffId } = await request.json()

    if (!staffId) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()
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

    // Only owners and managers can remove staff
    if (role !== 'owner' && role !== 'manager') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // First, verify the staff member belongs to this restaurant
    const { data: staffMember, error: fetchError } = await supabase
      .from('restaurant_staff')
      .select('*')
      .eq('id', staffId)
      .eq('restaurant_id', restaurant.id)
      .single()

    if (fetchError || !staffMember) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      )
    }

    // Don't allow removing the owner
    if (staffMember.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove the restaurant owner' },
        { status: 400 }
      )
    }

    // Remove the staff member (set as inactive first)
    const { error: updateError } = await supabase
      .from('restaurant_staff')
      .update({ 
        is_active: false
      })
      .eq('id', staffId)

    if (updateError) {
      console.error('Error deactivating staff member:', updateError)
      return NextResponse.json(
        { error: 'Failed to remove staff member' },
        { status: 500 }
      )
    }

    // CRITICAL: Delete the user account from Supabase Auth to prevent re-login
    const adminSupabase = createAdminClient()
    console.log('🗑️ Deleting user account for staff member:', staffMember.user_id)
    
    const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(
      staffMember.user_id
    )

    if (deleteAuthError) {
      console.error('❌ Error deleting user from Auth:', deleteAuthError)
      // Note: We don't fail the request here because the staff member is already deactivated
      // The account deletion is a security enhancement
      console.log('⚠️ Staff member deactivated but user account deletion failed')
    } else {
      console.log('✅ User account deleted successfully')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Staff member removed successfully' 
    })

  } catch (error) {
    console.error('Error in remove staff API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
