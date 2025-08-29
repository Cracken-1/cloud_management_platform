# 🔧 Superadmin Authentication Troubleshooting Guide

## Common Authentication Issues and Solutions

### Issue 1: "Invalid login credentials" Error

**Possible Causes:**
1. **Email not verified**: Supabase requires email verification before login
2. **User profile not created**: The superadmin setup process may have failed
3. **Incorrect credentials**: Wrong email or password
4. **Account not activated**: User profile exists but is_active = false

**Solutions:**

#### Step 1: Check if superadmin was created successfully
```sql
-- Run this query in Supabase SQL Editor
SELECT 
  up.id,
  up.email,
  up.role,
  up.is_active,
  up.is_verified,
  up.email_verified_at,
  au.email_confirmed_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
WHERE up.role = 'SUPERADMIN';
```

#### Step 2: Check authentication table
```sql
-- Check if user exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'your-superadmin-email@domain.com';
```

#### Step 3: Manual superadmin creation (if needed)
If the superadmin doesn't exist, create manually:

```sql
-- 1. First, create the auth user (do this via Supabase Dashboard > Authentication > Users)
-- Click "Add User" and create with email/password

-- 2. Then create the profile (replace USER_ID with the actual UUID from step 1)
INSERT INTO user_profiles (
  id,
  email,
  first_name,
  last_name,
  phone_number,
  role,
  is_active,
  is_verified,
  email_verified_at,
  preferences
) VALUES (
  'USER_ID_FROM_AUTH_USERS',
  'your-email@domain.com',
  'Your',
  'Name',
  '+1234567890',
  'SUPERADMIN',
  true,
  true,
  NOW(),
  '{
    "theme": "light",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "dashboard": {
      "default_view": "overview",
      "items_per_page": 25
    }
  }'::jsonb
);

-- 3. Create system tenant (if it doesn't exist)
INSERT INTO tenants (
  id,
  name,
  domain,
  subscription_tier,
  is_active,
  business_type,
  currency,
  timezone,
  settings,
  branding
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'System Administration',
  'system.admin.platform',
  'ENTERPRISE',
  true,
  'PLATFORM',
  'USD',
  'UTC',
  '{
    "platform_admin": true,
    "multi_tenant_enabled": true,
    "advanced_features": true,
    "maintenance_mode": false,
    "registration_enabled": true
  }'::jsonb,
  '{
    "primary_color": "#1f2937",
    "secondary_color": "#6b7280",
    "accent_color": "#3b82f6",
    "logo_url": null,
    "favicon_url": null
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 4. Assign superadmin role to system tenant
INSERT INTO user_tenant_roles (
  user_id,
  tenant_id,
  role,
  granted_by,
  granted_at,
  permissions
) VALUES (
  'USER_ID_FROM_AUTH_USERS',
  '00000000-0000-0000-0000-000000000000',
  'SUPERADMIN',
  'USER_ID_FROM_AUTH_USERS',
  NOW(),
  '{
    "platform_admin": true,
    "tenant_management": true,
    "user_management": true,
    "system_settings": true,
    "analytics": true,
    "billing": true
  }'::jsonb
);
```

### Issue 2: "User profile not found" Error

**Cause**: The user exists in auth.users but not in user_profiles table.

**Solution**: Create the missing profile using the SQL from Step 3 above.

### Issue 3: "Account has been deactivated" Error

**Cause**: User profile exists but is_active = false.

**Solution**:
```sql
UPDATE user_profiles 
SET is_active = true 
WHERE email = 'your-superadmin-email@domain.com';
```

### Issue 4: Email Verification Issues

**Cause**: Supabase email confirmation not working.

**Solutions**:

#### Option 1: Manual email confirmation
```sql
-- Update auth.users to mark email as confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-superadmin-email@domain.com';

-- Update user_profiles
UPDATE user_profiles 
SET is_verified = true, email_verified_at = NOW() 
WHERE email = 'your-superadmin-email@domain.com';
```

#### Option 2: Disable email confirmation temporarily
In Supabase Dashboard:
1. Go to Authentication > Settings
2. Uncheck "Enable email confirmations"
3. Try logging in
4. Re-enable email confirmations after successful login

### Issue 5: Environment Variables

**Check these environment variables are set correctly:**

```bash
# In Vercel or your deployment platform
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPERADMIN_CODE=YourSecureCode2024!
```

### Issue 6: RLS Policies

**Check if RLS policies are blocking access:**

```sql
-- Check if policies exist and are correct
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'user_tenant_roles', 'tenants');
```

If policies are too restrictive, temporarily disable RLS for testing:
```sql
-- ONLY FOR TESTING - Re-enable after fixing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenant_roles DISABLE ROW LEVEL SECURITY;
```

## Quick Diagnostic Checklist

Run through this checklist to identify the issue:

- [ ] **Environment variables set correctly**
- [ ] **Supabase project is active and accessible**
- [ ] **User exists in auth.users table**
- [ ] **User profile exists in user_profiles table**
- [ ] **User role is 'SUPERADMIN'**
- [ ] **User is_active = true**
- [ ] **Email is confirmed (email_confirmed_at is not null)**
- [ ] **System tenant exists**
- [ ] **User has role assignment in user_tenant_roles**
- [ ] **RLS policies allow access**

## Testing the Fix

After applying fixes, test with these steps:

1. **Clear browser cache and cookies**
2. **Try logging in with correct credentials**
3. **Check browser developer console for errors**
4. **Verify redirect to /superadmin/dashboard**

## Prevention

To prevent future issues:

1. **Always use the registration form at `/superadmin/register`**
2. **Ensure email verification is working before going live**
3. **Test the complete flow in a staging environment**
4. **Keep backups of working database states**
5. **Monitor authentication logs regularly**

## Getting Help

If issues persist:

1. **Check Supabase logs** in the Dashboard > Logs
2. **Review browser network tab** for failed requests
3. **Check server logs** for detailed error messages
4. **Verify database schema** matches the expected structure

## Emergency Access

If completely locked out:

1. **Use Supabase Dashboard** to create a user manually
2. **Run the manual SQL scripts** provided above
3. **Temporarily disable RLS** for emergency access
4. **Contact support** with specific error messages and logs