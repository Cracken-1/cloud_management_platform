import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Protect superadmin routes
  if (request.nextUrl.pathname.startsWith('/superadmin')) {
    // Allow login page
    if (request.nextUrl.pathname === '/superadmin/login') {
      return res;
    }

    if (!session) {
      return NextResponse.redirect(new URL('/superadmin/login', request.url));
    }

    // Check superadmin role
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'SUPERADMIN' || profile.status !== 'active') {
        return NextResponse.redirect(new URL('/superadmin/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/superadmin/login', request.url));
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow login page
    if (request.nextUrl.pathname === '/admin/login') {
      return res;
    }

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check admin role
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', session.user.id)
        .single();

      if (!profile || !['ORG_ADMIN', 'USER', 'SUPERADMIN'].includes(profile.role) || profile.status !== 'active') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/superadmin/:path*',
    '/admin/:path*'
  ],
};