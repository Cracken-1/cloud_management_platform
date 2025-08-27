import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Handle superadmin login
    if (email === 'superadmin@cloudmanager.app' && password === 'superadmin123') {
      // Create or get superadmin user
      let { data: existingUser } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (!existingUser) {
        // Create superadmin user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: 'Super Administrator',
            role: 'SUPERADMIN'
          }
        });

        if (authError) {
          return NextResponse.json({ error: 'Failed to create superadmin' }, { status: 500 });
        }

        // Create user profile
        await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: authUser.user.id,
            email,
            full_name: 'Super Administrator',
            role: 'SUPERADMIN',
            is_active: true,
            is_verified: true
          });
      }

      // Generate login link
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/superadmin`
        }
      });

      if (signInError) {
        return NextResponse.json({ error: 'Failed to generate login link' }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true,
        loginUrl: signInData.properties.action_link,
        user: { role: 'SUPERADMIN' }
      });
    }

    // Handle regular user login
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
      }
    });

    if (signInError) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Get user profile to determine role
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('role, is_active, is_verified')
      .eq('email', email)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!userProfile.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
    }

    if (!userProfile.is_verified) {
      return NextResponse.json({ 
        error: 'Account pending verification',
        requiresVerification: true 
      }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true,
      loginUrl: signInData.properties.action_link,
      user: { role: userProfile.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
