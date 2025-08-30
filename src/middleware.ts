import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect superadmin routes
  if (request.nextUrl.pathname.startsWith('/superadmin')) {
    // Allow login and registration pages without authentication
    if (request.nextUrl.pathname === '/superadmin/login' || request.nextUrl.pathname === '/superadmin/register') {
      return res;
    }

    // Require authentication for other superadmin routes
    if (!session) {
      return NextResponse.redirect(new URL('/superadmin/login', request.url));
    }

    // Check if user has superadmin role
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, is_active')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'SUPERADMIN' || !profile.is_active) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (error) {
      console.error('Middleware auth check error:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check if user has admin role
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, is_active')
        .eq('id', session.user.id)
        .single();

      if (!profile || !['ADMIN', 'SUPERADMIN'].includes(profile.role) || !profile.is_active) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } catch (error) {
      console.error('Middleware auth check error:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/superadmin/:path*',
    '/admin/:path*',
    '/api/superadmin/:path*',
    '/api/admin/:path*'
  ],
};