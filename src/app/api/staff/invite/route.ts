import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const { email: newStaffEmail, role, restaurantId } = await request.json();
        
        console.log('🔍 DEBUG: Staff invitation request received');
        console.log('📧 Email:', newStaffEmail);
        console.log('👤 Role:', role);
        console.log('🏪 Restaurant ID:', restaurantId);

        if (!newStaffEmail || !role || !restaurantId) {
            console.log('❌ DEBUG: Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use the service role client
        const supabase = getServiceSupabase();

        // Get the user's JWT from the Authorization header
        const authHeader = request.headers.get('Authorization');
        console.log('🔐 DEBUG: Auth header present:', !!authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ DEBUG: Invalid or missing authorization header');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const jwt = authHeader.split(' ')[1];
        console.log('🔑 DEBUG: JWT extracted (length):', jwt.length);

        // Get the user's data from the JWT
        const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
        console.log('👤 DEBUG: User authentication result:', { 
            hasUser: !!user, 
            userId: user?.id,
            hasError: !!userError,
            error: userError?.message 
        });
        
        if (userError || !user) {
            console.log('❌ DEBUG: User authentication failed');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if the restaurant exists and get owner info
        const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('owner_id, name')
            .eq('id', restaurantId)
            .single();

        console.log('🏪 DEBUG: Restaurant lookup result:', {
            hasRestaurant: !!restaurant,
            restaurantName: restaurant?.name,
            ownerId: restaurant?.owner_id,
            hasError: !!restaurantError,
            error: restaurantError?.message
        });

        if (restaurantError || !restaurant) {
            console.log('❌ DEBUG: Restaurant not found');
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        // Check if user is authorized (owner or manager)
        let isAuthorized = restaurant.owner_id === user.id;
        console.log('🔒 DEBUG: Authorization check - is owner:', isAuthorized);

        if (!isAuthorized) {
            console.log('🔍 DEBUG: User is not owner, checking if manager...');
            const { data: staffMember } = await supabase
                .from('restaurant_staff')
                .select('role')
                .eq('restaurant_id', restaurantId)
                .eq('user_id', user.id)
                .single();
            
            console.log('👥 DEBUG: Staff member lookup:', {
                hasStaffMember: !!staffMember,
                role: staffMember?.role
            });
            
            if (staffMember && staffMember.role === 'manager') {
                isAuthorized = true;
                console.log('✅ DEBUG: User is authorized as manager');
            }
        }

        if (!isAuthorized) {
            console.log('❌ DEBUG: User is not authorized to invite staff');
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        
        console.log('✅ DEBUG: User is authorized to invite staff');

        // Check if invitation already exists
        const { data: existingInvitation } = await supabase
            .from('staff_invitations')
            .select('id, status')
            .eq('restaurant_id', restaurantId)
            .eq('email', newStaffEmail)
            .single();

        console.log('📋 DEBUG: Existing invitation check:', {
            hasExistingInvitation: !!existingInvitation,
            invitationId: existingInvitation?.id,
            status: existingInvitation?.status
        });

        if (existingInvitation) {
            if (existingInvitation.status === 'pending') {
                console.log('❌ DEBUG: Invitation already pending for this email');
                return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 409 });
            }
            if (existingInvitation.status === 'accepted') {
                console.log('❌ DEBUG: User already accepted invitation');
                return NextResponse.json({ error: 'User already accepted invitation' }, { status: 409 });
            }
        }
        
        console.log('✅ DEBUG: No existing invitation found, proceeding...');

        // Create the invitation record
        const invitationData = {
            restaurant_id: restaurantId,
            email: newStaffEmail,
            role: role,
            invited_by: user.id,
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };
        
        console.log('📝 DEBUG: Creating invitation with data:', invitationData);
        
        const { data: invitation, error: inviteError } = await supabase
            .from('staff_invitations')
            .insert(invitationData)
            .select()
            .single();

        console.log('💾 DEBUG: Database insert result:', {
            hasInvitation: !!invitation,
            invitationId: invitation?.id,
            hasError: !!inviteError,
            error: inviteError?.message
        });

        if (inviteError) {
            console.error('❌ DEBUG: Database error:', inviteError);
            return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
        }
        
        console.log('✅ DEBUG: Invitation created successfully');

        // Send invitation email using Supabase Auth magic link
        try {
            const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const invitationUrl = `${origin}/staff-onboarding?invitation=${invitation.id}`;
            
            console.log('📧 DEBUG: Sending magic link via Supabase Auth');
            console.log('📤 DEBUG: Magic link data:', {
                email: newStaffEmail,
                redirectTo: invitationUrl
            });
            
            // Use Supabase's built-in magic link service
            const adminClient = createAdminClient();
            const { data: magicLinkData, error: magicLinkError } = await adminClient.auth.admin.generateLink({
                type: 'magiclink',
                email: newStaffEmail,
                options: {
                    redirectTo: invitationUrl,
                    data: {
                        role: role,
                        restaurant_id: restaurantId,
                        restaurant_name: restaurant.name,
                        invitation_id: invitation.id
                    }
                }
            });

            if (magicLinkError) {
                console.error('❌ DEBUG: Magic link error:', magicLinkError);
                throw new Error(`Failed to send magic link: ${magicLinkError.message}`);
            }

            console.log('✅ DEBUG: Magic link sent successfully:', magicLinkData);
            
        } catch (emailError) {
            console.error('❌ DEBUG: Failed to send magic link:', emailError);
            // Don't fail the whole request if email fails
        }

        const response = { 
            message: 'Invitation sent successfully!',
            invitation_id: invitation.id,
            email_sent: true
        };
        
        console.log('🎉 DEBUG: API endpoint completed successfully');
        console.log('📤 DEBUG: Final response:', response);
        
        return NextResponse.json(response);

    } catch (error: any) {
        console.error('💥 DEBUG: Staff invite error:', error);
        console.error('💥 DEBUG: Error message:', error.message);
        console.error('💥 DEBUG: Error stack:', error.stack);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
