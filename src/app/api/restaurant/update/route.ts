import { createClient } from '@/lib/supabase/server'
import { getUserRestaurant } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, address, description } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
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

    // Only owners and managers can update restaurant info
    if (role !== 'owner' && role !== 'manager') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Update the restaurant information
    const { error: updateError } = await supabase
      .from('restaurants')
      .update({
        name,
        email,
        phone,
        address,
        description
      })
      .eq('id', restaurant.id)

    if (updateError) {
      console.error('Error updating restaurant:', updateError)
      return NextResponse.json(
        { error: 'Failed to update restaurant information' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Restaurant information updated successfully' 
    })

  } catch (error) {
    console.error('Error in update restaurant API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
