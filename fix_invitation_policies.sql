-- Fix RLS policies to allow invitation token access

-- Policy for staff_invitations
DROP POLICY IF EXISTS "Allow token-based invitation access" ON staff_invitations;
CREATE POLICY "Allow token-based invitation access" ON staff_invitations
FOR SELECT 
TO anon
USING (status = 'pending' AND expires_at > NOW());

-- Policy for restaurants (needed for the JOIN in invitation query)
DROP POLICY IF EXISTS "Allow reading restaurant names for invitations" ON restaurants;
CREATE POLICY "Allow reading restaurant names for invitations" ON restaurants
FOR SELECT 
TO anon
USING (EXISTS (
  SELECT 1 FROM staff_invitations 
  WHERE restaurant_id = restaurants.id 
  AND status = 'pending' 
  AND expires_at > NOW()
));
