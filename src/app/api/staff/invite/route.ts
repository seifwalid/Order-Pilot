import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const { email: newStaffEmail, role, restaurantId } = await request.json();

        // 1. Create the Supabase Admin Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Get the user's JWT from the Authorization header to identify them
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        const jwt = authHeader.split(' ')[1];

        // 3. Get the user's data from the JWT
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);
        if (userError || !user) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 4. Check inviting user's role (must be owner or manager) using the Admin Client
        const { data: restaurant, error: restaurantError } = await supabaseAdmin
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();

        if (restaurantError || !restaurant) {
            return new NextResponse(JSON.stringify({ error: 'Restaurant not found' }), { status: 404 });
        }

        let isAuthorized = restaurant.owner_id === user.id;

        if (!isAuthorized) {
            const { data: staffMember } = await supabaseAdmin
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
            return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
        }

        // 5. Send invitation email via Supabase Auth using the same Admin Client
        const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            newStaffEmail,
            { 
              redirectTo: `${new URL(request.url).origin}/login`,
              data: {
                restaurant_id: restaurantId,
                role: role
              }
            }
        );

        if (inviteError) {
            // Check for the specific error indicating the user already exists
            if (inviteError.message.includes('User already registered')) {
                return new NextResponse(JSON.stringify({ error: 'This user already has an account. You cannot invite an existing user.' }), { status: 409 });
            }
            return new NextResponse(JSON.stringify({ error: `Failed to invite user: ${inviteError.message}` }), { status: 500 });
        }

        return NextResponse.json({ message: 'Invitation sent successfully.' });

    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
