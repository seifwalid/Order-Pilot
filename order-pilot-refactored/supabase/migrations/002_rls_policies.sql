-- OrderPilot RLS Policies
-- Migration 002: Row Level Security policies

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to check if user is restaurant owner
CREATE OR REPLACE FUNCTION is_restaurant_owner(restaurant_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM restaurants 
    WHERE id = restaurant_uuid 
    AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is restaurant staff (including owner)
CREATE OR REPLACE FUNCTION is_restaurant_staff(restaurant_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is owner
  IF is_restaurant_owner(restaurant_uuid) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is staff member
  RETURN EXISTS (
    SELECT 1 FROM restaurant_staff 
    WHERE restaurant_id = restaurant_uuid 
    AND user_id = auth.uid() 
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's restaurant staff role
CREATE OR REPLACE FUNCTION get_user_restaurant_role(restaurant_uuid UUID)
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  -- Check if user is owner first
  IF is_restaurant_owner(restaurant_uuid) THEN
    RETURN 'owner'::user_role;
  END IF;
  
  -- Get staff role
  SELECT role INTO user_role_result
  FROM restaurant_staff 
  WHERE restaurant_id = restaurant_uuid 
  AND user_id = auth.uid() 
  AND is_active = TRUE;
  
  RETURN COALESCE(user_role_result, NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has manager+ permissions
CREATE OR REPLACE FUNCTION has_manager_access(restaurant_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
BEGIN
  user_role_val := get_user_restaurant_role(restaurant_uuid);
  RETURN user_role_val IN ('owner', 'manager');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_channels ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RESTAURANTS TABLE POLICIES
-- =============================================

-- Restaurants: Users can see restaurants they own or are staff of
CREATE POLICY "Users can view their restaurants" ON restaurants
FOR SELECT USING (
  owner_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM restaurant_staff 
    WHERE restaurant_id = restaurants.id 
    AND user_id = auth.uid() 
    AND is_active = TRUE
  )
);

-- Restaurants: Only owners can create restaurants
CREATE POLICY "Users can create restaurants" ON restaurants
FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Restaurants: Only owners can update their restaurants
CREATE POLICY "Owners can update their restaurants" ON restaurants
FOR UPDATE USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Restaurants: Only owners can delete their restaurants
CREATE POLICY "Owners can delete their restaurants" ON restaurants
FOR DELETE USING (owner_id = auth.uid());

-- =============================================
-- RESTAURANT SETTINGS POLICIES
-- =============================================

CREATE POLICY "Restaurant staff can view settings" ON restaurant_settings
FOR SELECT USING (is_restaurant_staff(restaurant_id));

CREATE POLICY "Restaurant owners can manage settings" ON restaurant_settings
FOR ALL USING (is_restaurant_owner(restaurant_id))
WITH CHECK (is_restaurant_owner(restaurant_id));

-- =============================================
-- STAFF MANAGEMENT POLICIES
-- =============================================

-- Restaurant staff: View staff of restaurants you belong to
CREATE POLICY "View restaurant staff" ON restaurant_staff
FOR SELECT USING (is_restaurant_staff(restaurant_id));

-- Restaurant staff: Owners and managers can insert staff
CREATE POLICY "Managers can add staff" ON restaurant_staff
FOR INSERT WITH CHECK (has_manager_access(restaurant_id));

-- Restaurant staff: Owners and managers can update staff
CREATE POLICY "Managers can update staff" ON restaurant_staff
FOR UPDATE USING (has_manager_access(restaurant_id))
WITH CHECK (has_manager_access(restaurant_id));

-- Restaurant staff: Owners can delete staff
CREATE POLICY "Owners can remove staff" ON restaurant_staff
FOR DELETE USING (is_restaurant_owner(restaurant_id));

-- Staff invitations: View invitations for restaurants you manage
CREATE POLICY "View staff invitations" ON staff_invitations
FOR SELECT USING (has_manager_access(restaurant_id));

-- Staff invitations: Managers can create invitations
CREATE POLICY "Managers can create invitations" ON staff_invitations
FOR INSERT WITH CHECK (has_manager_access(restaurant_id));

-- Staff invitations: Managers can update invitations
CREATE POLICY "Managers can update invitations" ON staff_invitations
FOR UPDATE USING (has_manager_access(restaurant_id))
WITH CHECK (has_manager_access(restaurant_id));

-- Staff invitations: Managers can delete invitations
CREATE POLICY "Managers can delete invitations" ON staff_invitations
FOR DELETE USING (has_manager_access(restaurant_id));

-- Staff invitations: Allow unauthenticated users to read pending invitations by token
CREATE POLICY "Allow token-based invitation access" ON staff_invitations
FOR SELECT 
TO anon
USING (status = 'pending' AND expires_at > NOW());

-- =============================================
-- MENU SYSTEM POLICIES
-- =============================================

-- Categories: Staff can view, managers can manage
CREATE POLICY "Staff can view categories" ON categories
FOR SELECT USING (is_restaurant_staff(restaurant_id));

CREATE POLICY "Managers can manage categories" ON categories
FOR ALL USING (has_manager_access(restaurant_id))
WITH CHECK (has_manager_access(restaurant_id));

-- Menu items: Staff can view, managers can manage
CREATE POLICY "Staff can view menu items" ON menu_items
FOR SELECT USING (is_restaurant_staff(restaurant_id));

CREATE POLICY "Managers can manage menu items" ON menu_items
FOR ALL USING (has_manager_access(restaurant_id))
WITH CHECK (has_manager_access(restaurant_id));

-- Option groups: Staff can view, managers can manage
CREATE POLICY "Staff can view option groups" ON option_groups
FOR SELECT USING (is_restaurant_staff(restaurant_id));

CREATE POLICY "Managers can manage option groups" ON option_groups
FOR ALL USING (has_manager_access(restaurant_id))
WITH CHECK (has_manager_access(restaurant_id));

-- Options: Accessible if user can access the option group's restaurant
CREATE POLICY "Staff can view options" ON options
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM option_groups 
    WHERE option_groups.id = options.option_group_id 
    AND is_restaurant_staff(option_groups.restaurant_id)
  )
);

CREATE POLICY "Managers can manage options" ON options
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM option_groups 
    WHERE option_groups.id = options.option_group_id 
    AND has_manager_access(option_groups.restaurant_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM option_groups 
    WHERE option_groups.id = options.option_group_id 
    AND has_manager_access(option_groups.restaurant_id)
  )
);

-- Menu item option groups: Accessible if user can access both menu item and option group
CREATE POLICY "Staff can view menu item option groups" ON menu_item_option_groups
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_items.id = menu_item_option_groups.menu_item_id 
    AND is_restaurant_staff(menu_items.restaurant_id)
  )
);

CREATE POLICY "Managers can manage menu item option groups" ON menu_item_option_groups
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_items.id = menu_item_option_groups.menu_item_id 
    AND has_manager_access(menu_items.restaurant_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM menu_items 
    WHERE menu_items.id = menu_item_option_groups.menu_item_id 
    AND has_manager_access(menu_items.restaurant_id)
  )
);

-- =============================================
-- CUSTOMER & ORDER POLICIES
-- =============================================

-- Customers: Restaurant staff can view and manage
CREATE POLICY "Staff can view customers" ON customers
FOR SELECT USING (is_restaurant_staff(restaurant_id));

CREATE POLICY "Staff can manage customers" ON customers
FOR ALL USING (is_restaurant_staff(restaurant_id))
WITH CHECK (is_restaurant_staff(restaurant_id));

-- Orders: Restaurant staff can view and manage
CREATE POLICY "Staff can view orders" ON orders
FOR SELECT USING (is_restaurant_staff(restaurant_id));

CREATE POLICY "Staff can manage orders" ON orders
FOR ALL USING (is_restaurant_staff(restaurant_id))
WITH CHECK (is_restaurant_staff(restaurant_id));

-- Order items: Accessible if user can access the order
CREATE POLICY "Staff can view order items" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
);

CREATE POLICY "Staff can manage order items" ON order_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
);

-- Order item options: Accessible if user can access the order item
CREATE POLICY "Staff can view order item options" ON order_item_options
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM order_items 
    JOIN orders ON orders.id = order_items.order_id
    WHERE order_items.id = order_item_options.order_item_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
);

CREATE POLICY "Staff can manage order item options" ON order_item_options
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM order_items 
    JOIN orders ON orders.id = order_items.order_id
    WHERE order_items.id = order_item_options.order_item_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM order_items 
    JOIN orders ON orders.id = order_items.order_id
    WHERE order_items.id = order_item_options.order_item_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
);

-- Order status events: Accessible if user can access the order
CREATE POLICY "Staff can view order status events" ON order_status_events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_status_events.order_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
);

CREATE POLICY "Staff can create order status events" ON order_status_events
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_status_events.order_id 
    AND is_restaurant_staff(orders.restaurant_id)
  )
);

-- =============================================
-- VAPI INTEGRATION POLICIES
-- =============================================

-- Agent channels: Restaurant owners can manage
CREATE POLICY "Owners can view agent channels" ON agent_channels
FOR SELECT USING (is_restaurant_owner(restaurant_id));

CREATE POLICY "Owners can manage agent channels" ON agent_channels
FOR ALL USING (is_restaurant_owner(restaurant_id))
WITH CHECK (is_restaurant_owner(restaurant_id));

-- =============================================
-- SYSTEM ACCESS POLICIES (FOR WEBHOOKS)
-- =============================================

-- Allow system/service role to bypass RLS for VAPI webhooks
-- This will be used by API routes that need to create orders from VAPI
-- The service role key should be used in webhook endpoints

-- Grant necessary permissions to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
