-- Migration: Create staff_invitations table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.staff_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff')),
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invited_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    UNIQUE(restaurant_id, email)
);

-- Enable RLS
ALTER TABLE public.staff_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view invitations for their restaurants" ON public.staff_invitations
    FOR SELECT USING (
        restaurant_id IN (
            SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
            UNION
            SELECT restaurant_id FROM public.restaurant_staff WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Restaurant owners and managers can create invitations" ON public.staff_invitations
    FOR INSERT WITH CHECK (
        restaurant_id IN (
            SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
            UNION
            SELECT restaurant_id FROM public.restaurant_staff 
            WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
        )
    );

CREATE POLICY "Restaurant owners and managers can update invitations" ON public.staff_invitations
    FOR UPDATE USING (
        restaurant_id IN (
            SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
            UNION
            SELECT restaurant_id FROM public.restaurant_staff 
            WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
        )
    );
