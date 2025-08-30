import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { isAuthorizedSuperadmin } from '@/lib/auth/superadmin-access';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange code for session using Supabase
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Check if this is a superadmin login attempt
    const isFromSuperadminLogin = url.searchParams.get('from') === 'superadmin';
    
    if (isFromSuperadminLogin && !isAuthorizedSuperadmin(data.user.email || '')) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/superadmin/login?error=unauthorized', request.url));
    }

    // Get user profile to determine proper redirect
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', data.user.id)
      .single();

    // Handle superadmin login specifically
    if (isFromSuperadminLogin) {
      if (!profile || profile.role !== 'SUPERADMIN') {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/superadmin/login?error=unauthorized', request.url));
      }
      if (!profile.is_active) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/superadmin/login?error=inactive', request.url));
      }
      return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
    }

    // For regular login, create profile if it doesn't exist
    if (!profile) {
      // Create a basic user profile for new users
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          role: 'CUSTOMER',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
      
      // Redirect new users to admin (they'll need proper role assignment)
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!profile.is_active) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/error?message=inactive', request.url));
    }

    // Redirect based on user role
    let redirectTo = '/admin';
    if (profile.role === 'SUPERADMIN') {
      redirectTo = '/superadmin/dashboard';
    }
    
    // Override with custom redirect if provided
    const customRedirect = url.searchParams.get('redirect_to');
    if (customRedirect) {
      redirectTo = customRedirect;
    }

    return NextResponse.redirect(new URL(redirectTo, request.url));
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}