-- Fix RLS policy for staff onboarding
-- Allow users to add themselves to restaurant_staff if they have a valid invitation

-- Add policy to allow users to insert themselves via valid invitation
CREATE POLICY "Users can join via valid invitation" ON restaurant_staff
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM staff_invitations 
    WHERE restaurant_id = restaurant_staff.restaurant_id
    AND email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'pending'
    AND expires_at > NOW()
  )
);
