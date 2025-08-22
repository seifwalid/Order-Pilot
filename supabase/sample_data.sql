-- Sample data for OrderPilot testing
-- This creates sample menu items and orders for development

-- First, get the restaurant ID (replace with actual restaurant ID)
-- Run: SELECT id FROM restaurants WHERE name = 'Mazen Khalil';

-- For now, let's use a variable approach
DO $$
DECLARE
    restaurant_uuid UUID;
    owner_uuid UUID;
    category_appetizers UUID;
    category_mains UUID;
    category_desserts UUID;
    item_burger UUID;
    item_pizza UUID;
    item_salad UUID;
    customer_1 UUID;
    customer_2 UUID;
    order_1 UUID;
    order_2 UUID;
    order_3 UUID;
BEGIN
    -- Get restaurant and owner IDs
    SELECT id, owner_id INTO restaurant_uuid, owner_uuid 
    FROM restaurants 
    WHERE name = 'Mazen Khalil' 
    LIMIT 1;

    IF restaurant_uuid IS NULL THEN
        RAISE EXCEPTION 'Restaurant not found. Please ensure you have completed onboarding.';
    END IF;

    -- Create categories
    INSERT INTO categories (id, restaurant_id, name, description, position) VALUES
    (uuid_generate_v4(), restaurant_uuid, 'Appetizers', 'Start your meal right', 1),
    (uuid_generate_v4(), restaurant_uuid, 'Main Courses', 'Hearty and delicious mains', 2),
    (uuid_generate_v4(), restaurant_uuid, 'Desserts', 'Sweet endings', 3)
    RETURNING id INTO category_appetizers;

    -- Get category IDs
    SELECT id INTO category_appetizers FROM categories WHERE restaurant_id = restaurant_uuid AND name = 'Appetizers';
    SELECT id INTO category_mains FROM categories WHERE restaurant_id = restaurant_uuid AND name = 'Main Courses';
    SELECT id INTO category_desserts FROM categories WHERE restaurant_id = restaurant_uuid AND name = 'Desserts';

    -- Create menu items
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_available) VALUES
    (uuid_generate_v4(), restaurant_uuid, category_appetizers, 'Buffalo Wings', 'Crispy chicken wings with buffalo sauce', 12.99, true),
    (uuid_generate_v4(), restaurant_uuid, category_appetizers, 'Mozzarella Sticks', 'Golden fried mozzarella with marinara', 8.99, true),
    (uuid_generate_v4(), restaurant_uuid, category_mains, 'Classic Burger', 'Beef patty with lettuce, tomato, and cheese', 15.99, true),
    (uuid_generate_v4(), restaurant_uuid, category_mains, 'Margherita Pizza', 'Fresh tomato, mozzarella, and basil', 18.99, true),
    (uuid_generate_v4(), restaurant_uuid, category_mains, 'Caesar Salad', 'Crisp romaine with parmesan and croutons', 13.99, true),
    (uuid_generate_v4(), restaurant_uuid, category_desserts, 'Chocolate Cake', 'Rich chocolate cake with frosting', 7.99, true)
    RETURNING id INTO item_burger;

    -- Get some menu item IDs for orders
    SELECT id INTO item_burger FROM menu_items WHERE restaurant_id = restaurant_uuid AND name = 'Classic Burger';
    SELECT id INTO item_pizza FROM menu_items WHERE restaurant_id = restaurant_uuid AND name = 'Margherita Pizza';
    SELECT id INTO item_salad FROM menu_items WHERE restaurant_id = restaurant_uuid AND name = 'Caesar Salad';

    -- Create customers
    INSERT INTO customers (id, restaurant_id, name, phone, email) VALUES
    (uuid_generate_v4(), restaurant_uuid, 'John Smith', '+1234567890', 'john@example.com'),
    (uuid_generate_v4(), restaurant_uuid, 'Sarah Johnson', '+1987654321', 'sarah@example.com')
    RETURNING id INTO customer_1;

    SELECT id INTO customer_1 FROM customers WHERE restaurant_id = restaurant_uuid AND name = 'John Smith';
    SELECT id INTO customer_2 FROM customers WHERE restaurant_id = restaurant_uuid AND name = 'Sarah Johnson';

    -- Create sample orders
    INSERT INTO orders (id, restaurant_id, customer_id, customer_name, customer_phone, type, status, subtotal, tax_amount, total_amount, special_instructions, source, placed_at) VALUES
    (uuid_generate_v4(), restaurant_uuid, customer_1, 'John Smith', '+1234567890', 'takeout', 'pending', 15.99, 1.40, 17.39, 'No onions please', 'manual', NOW() - INTERVAL '5 minutes'),
    (uuid_generate_v4(), restaurant_uuid, customer_2, 'Sarah Johnson', '+1987654321', 'dine_in', 'preparing', 32.98, 2.89, 35.87, NULL, 'manual', NOW() - INTERVAL '15 minutes'),
    (uuid_generate_v4(), restaurant_uuid, NULL, 'Mike Wilson', '+1555666777', 'delivery', 'ready', 13.99, 1.22, 15.21, 'Extra dressing on the side', 'vapi', NOW() - INTERVAL '25 minutes')
    RETURNING id INTO order_1;

    -- Get order IDs
    SELECT id INTO order_1 FROM orders WHERE restaurant_id = restaurant_uuid AND customer_name = 'John Smith';
    SELECT id INTO order_2 FROM orders WHERE restaurant_id = restaurant_uuid AND customer_name = 'Sarah Johnson';
    SELECT id INTO order_3 FROM orders WHERE restaurant_id = restaurant_uuid AND customer_name = 'Mike Wilson';

    -- Create order items
    INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, total_price) VALUES
    -- Order 1: John's Burger
    (order_1, item_burger, 'Classic Burger', 1, 15.99, 15.99),
    
    -- Order 2: Sarah's Pizza and Wings
    (order_2, item_pizza, 'Margherita Pizza', 1, 18.99, 18.99),
    (order_2, (SELECT id FROM menu_items WHERE name = 'Buffalo Wings' AND restaurant_id = restaurant_uuid), 'Buffalo Wings', 1, 12.99, 12.99),
    
    -- Order 3: Mike's Salad
    (order_3, item_salad, 'Caesar Salad', 1, 13.99, 13.99);

    RAISE NOTICE 'Sample data created successfully for restaurant: %', restaurant_uuid;

END $$;
