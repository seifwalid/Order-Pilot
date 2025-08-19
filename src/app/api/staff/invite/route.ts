import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const { email: newStaffEmail, role, restaurantId } = await request.json();

        if (!newStaffEmail || !role || !restaurantId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use the service role client
        const supabase = getServiceSupabase();

        // Get the user's JWT from the Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const jwt = authHeader.split(' ')[1];

        // Get the user's data from the JWT
        const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if the restaurant exists and get owner info
        const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('owner_id, name')
            .eq('id', restaurantId)
            .single();

        if (restaurantError || !restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        // Check if user is authorized (owner or manager)
        let isAuthorized = restaurant.owner_id === user.id;

        if (!isAuthorized) {
            const { data: staffMember } = await supabase
                .from('restaurant_staff')
                .select('role')
                .eq('restaurant_id', restaurantId)
                .eq('user_id', user.id)
                .single();
            
            if (staffMember && staffMember.role === 'manager') {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if invitation already exists
        const { data: existingInvitation } = await supabase
            .from('staff_invitations')
            .select('id, status')
            .eq('restaurant_id', restaurantId)
            .eq('email', newStaffEmail)
            .single();

        if (existingInvitation) {
            if (existingInvitation.status === 'pending') {
                return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 409 });
            }
            if (existingInvitation.status === 'accepted') {
                return NextResponse.json({ error: 'User already accepted invitation' }, { status: 409 });
            }
        }

        // Create the invitation record
        const { data: invitation, error: inviteError } = await supabase
            .from('staff_invitations')
            .insert({
                restaurant_id: restaurantId,
                email: newStaffEmail,
                role: role,
                invited_by: user.id,
                status: 'pending',
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
            })
            .select()
            .single();

        if (inviteError) {
            console.error('Database error:', inviteError);
            return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
        }

        // Send invitation email using Supabase Edge Function
        try {
            const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-invitation-email`;
            
            const emailResponse = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                },
                body: JSON.stringify({
                    email: newStaffEmail,
                    invitationId: invitation.id,
                    restaurantName: restaurant.name,
                    role: role,
                    invitationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/staff-onboarding?invitation=${invitation.id}`
                })
            });

            if (emailResponse.ok) {
                const emailResult = await emailResponse.json();
                console.log('Edge function email result:', emailResult);
            } else {
                console.error('Edge function email failed:', emailResponse.status, await emailResponse.text());
            }
        } catch (emailError) {
            console.error('Failed to call edge function:', emailError);
            // Don't fail the whole request if email fails
        }

        return NextResponse.json({ 
            message: 'Invitation sent successfully!',
            invitation_id: invitation.id,
            email_sent: true
        });

    } catch (error: any) {
        console.error('Staff invite error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
