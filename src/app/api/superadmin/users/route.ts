import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { UserRole } from '@/lib/auth/roles';

export async function GET() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('user_profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        tenant_id,
        is_active,
        is_verified,
        created_at,
        last_login,
        tenants (
          name
        )
      `)
      .neq('role', 'CUSTOMER')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedUsers = users.map(user => ({
      ...user,
      tenant_name: user.tenants?.name || null,
      tenants: undefined
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, full_name, role, send_invitation } = await request.json();

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user in auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-8), // Temporary password
      email_confirm: true,
      user_metadata: {
        full_name,
        role
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authUser.user.id,
        email,
        full_name,
        role,
        is_active: true,
        is_verified: false
      })
      .select()
      .single();

    if (profileError) {
      // Cleanup auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Send invitation email if requested
    if (send_invitation) {
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/setup`
      });
    }

    return NextResponse.json({ 
      user: userProfile,
      message: send_invitation ? 'User created and invitation sent' : 'User created successfully'
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
