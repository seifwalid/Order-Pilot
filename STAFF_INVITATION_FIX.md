# Staff Invitation Fix

## Issue
The staff invitation functionality is failing with a 500 error because the `staff_invitations` table doesn't exist in the database.

## Solution
You need to run the database migration to create the required table.

## Steps to Fix

### 1. Go to Supabase Dashboard
- Navigate to your Supabase project: https://supabase.com/dashboard/project/jjuppwxmwubgbqqdyypw
- Go to the **SQL Editor** section

### 2. Run the Migration
- Copy the contents of `migration_staff_invitations.sql` from your project root
- Paste it into the SQL Editor
- Click **Run** to execute the migration

### 3. Verify the Table was Created
- Go to **Table Editor** in your Supabase dashboard
- You should see a new `staff_invitations` table

## What the Migration Does

The migration creates:
- `staff_invitations` table with proper structure
- Row Level Security (RLS) policies
- Proper foreign key constraints
- Unique constraints to prevent duplicate invitations

## Table Structure

```sql
staff_invitations:
- id: UUID (Primary Key)
- restaurant_id: UUID (References restaurants.id)
- email: TEXT (Email of invited user)
- role: TEXT (owner, manager, or staff)
- invited_by: UUID (References auth.users.id)
- invited_at: TIMESTAMP (When invitation was sent)
- accepted_at: TIMESTAMP (When invitation was accepted)
- expires_at: TIMESTAMP (When invitation expires)
- status: TEXT (pending, accepted, expired, cancelled)
```

## After Running the Migration

Once the table is created:
1. The staff invitation API will work properly
2. You can invite staff members through the settings page
3. Invitations will be stored in the database
4. You can track invitation status

## Next Steps

To implement full email functionality:
1. Set up an email service (SendGrid, AWS SES, etc.)
2. Create a Supabase Edge Function to send emails
3. Update the invitation system to send actual emails
4. Add invitation acceptance flow

## Current Status

- ✅ API endpoint fixed
- ✅ Error handling improved
- ✅ Migration file created
- ⏳ Database migration needs to be run
- ⏳ Email functionality needs to be implemented
