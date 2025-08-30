-- Setup script for creating superadmin user
-- Email: alphoncewekesamukaisi@gmail.com
-- Replace 'your-user-id' with the UUID from Supabase Auth after you sign up

-- First, sign up with your Gmail through the app, then get your user ID from Supabase Auth dashboard
-- Then run this SQL in your Supabase SQL editor:

INSERT INTO user_profiles (
  id, 
  email, 
  first_name, 
  last_name, 
  role, 
  is_active, 
  is_verified, 
  created_at, 
  updated_at
) VALUES (
  'your-user-id-from-supabase-auth', -- Replace with actual UUID from Auth
  'alphoncewekesamukaisi@gmail.com',
  'Your',                            -- Replace with your first name
  'Name',                            -- Replace with your last name
  'SUPERADMIN',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'SUPERADMIN',
  is_active = true,
  is_verified = true;