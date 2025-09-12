-- Add onboarding fields to restaurant_staff table
ALTER TABLE restaurant_staff 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(100),
ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE;

-- Add unique constraint on employee_id per restaurant
CREATE UNIQUE INDEX IF NOT EXISTS restaurant_staff_employee_id_unique 
ON restaurant_staff (restaurant_id, employee_id) 
WHERE employee_id IS NOT NULL;
