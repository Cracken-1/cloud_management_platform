import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function superadminMiddleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Check if user has superadmin role
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      console.error('Error fetching user profile:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check if user is active superadmin
    if (profile.role !== 'SUPERADMIN' || !profile.is_active) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Verify superadmin role in system tenant
    const { data: roleData, error: roleError } = await supabase
      .from('user_tenant_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('tenant_id', '00000000-0000-0000-0000-000000000000')
      .eq('role', 'SUPERADMIN')
      .single();

    if (roleError || !roleData) {
      console.error('Error verifying superadmin role:', roleError);
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return res;
  } catch (error) {
    console.error('Superadmin middleware error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

/**
 * Client-side hook for superadmin authentication
 */
export function useSuperadminAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    checkSuperadminAuth();
  }, []);

  const checkSuperadminAuth = async () => {
    try {
      const supabase = createClientComponentClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Check superadmin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, is_active, first_name, last_name, email')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'SUPERADMIN' && profile.is_active) {
        setUser(profile);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isAuthorized, user, checkAuth: checkSuperadminAuth };
}